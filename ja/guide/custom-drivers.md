# カスタムドライバー

<p class="lead">使いたいプロバイダーが組み込まれていなくても、ドライバーは小さなクラス 1 つで書けます。タイムアウト、並列実行、一部の失敗、安全なエラーメッセージは基底クラスが面倒を見てくれるので、書くのはプロバイダーの API の部分だけです。</p>

## ドライバーの完全な例 {#a-complete-driver}

1 リクエストにつき宛先を 1 件だけ受け付ける、架空のプロバイダー Acme 用のドライバーです。

```php
namespace App\Sms;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use MrRijal\LaravelSms\Drivers\HttpDriver;
use MrRijal\LaravelSms\SentMessage;
use MrRijal\LaravelSms\SmsMessage;
use MrRijal\LaravelSms\SmsResult;

class AcmeDriver extends HttpDriver
{
    protected string $label = 'Acme';

    protected function validateConfig(): void
    {
        $this->require('api_key', 'from');
    }

    public function send(SmsMessage $message): SmsResult
    {
        $text = $this->text($message);

        return $this->sendEach(
            $message,
            fn (PendingRequest $request, string $to) => $request
                ->withToken($this->value('api_key'))
                ->post('https://api.acme.test/v1/messages', [
                    'to' => $to,
                    'from' => $this->sender($message),
                    'text' => $text,
                ]),
            function (Response $response, string $to): SentMessage {
                if (! $response->successful()) {
                    $this->fail($response, 'error.message');
                }

                return new SentMessage($to, $this->jsonString($response, 'id'), 'accepted');
            },
        );
    }
}
```

`config/sms.php` に登録します。

```php
'drivers' => [
    // …
    'acme' => App\Sms\AcmeDriver::class,
],

'providers' => [
    // …
    'acme' => [
        'api_key' => env('ACME_API_KEY'),
        'from' => env('ACME_FROM'),
    ],
],
```

あとは組み込みのプロバイダーと同じように使えます。`Sms::provider('acme')`、フェイルオーバーチェーン、キュー、`php artisan sms:test --provider=acme`、どれもそのまま動きます。

## 基底クラスが提供するもの {#what-the-base-class-gives-you}

| メソッド | 用途 |
|---|---|
| `require('key', …)` | 設定が足りないときに "Acme configuration is incomplete" ですぐにエラーにする |
| `value('key')` | 必須の設定を、前後の空白を除いた文字列として読む |
| `string('key', $default)` / `bool('key')` | 任意の設定を読む |
| `oneOf('key', [...], $default)` | リージョンなど、決まった値だけを受け付ける |
| `httpsUrl('key', $default)` | HTTPS を使うベース URL だけを受け付ける |
| `text($message)` | 本文を取得する。テンプレートのみのメッセージはわかりやすいエラーで拒否する |
| `sender($message)` | メッセージの `from()`。なければ設定済みの送信元を使う |
| `sendEach(…)` | 宛先ごとに 1 リクエストを並列で実行し、一部の失敗も追跡する |
| `sendOnce(…)` | 全宛先を 1 リクエストで送る。一括送信エンドポイントを持つプロバイダー向け |
| `fail($response, 'json.path')` | プロバイダーが返した理由を 200 文字に切り詰め、`DeliveryException` をスローする |
| `jsonString($response, 'path')` | レスポンス本文から文字列（または整数）を読む |
| `cachedToken($clientId, fn () => …)` | OAuth トークンを取得し、有効期限の少し前までキャッシュする |

基底クラスが組み立てるリクエストには、タイムアウト、JSON の `Accept` ヘッダー、`User-Agent` があらかじめ設定されています。ほかのリクエストと同じように `Http::fake()` で捕捉することもできます。

## 一括送信エンドポイント {#bulk-endpoints}

プロバイダーが 1 回の呼び出しで多数の宛先を受け付けるなら、`sendOnce()` を使い、送信結果は自分で組み立てます。

```php
return $this->sendOnce(
    $message,
    fn (PendingRequest $request) => $request
        ->withToken($this->value('api_key'))
        ->post('https://api.acme.test/v1/batches', [
            'to' => $message->getTo(),
            'text' => $this->text($message),
        ]),
    function (Response $response) use ($message): SmsResult {
        if ($response->status() !== 201) {
            $this->fail($response, 'error');
        }

        return SmsResult::accepted($message->getTo(), $this->jsonString($response, 'batch_id'));
    },
);
```

プロバイダーが宛先ごとに結果を返す場合は、`failedRecipients` と、受け付けられた分の `partial` 結果を付けて `DeliveryException` をスローしてください。[ClickSend のドライバー](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php)がお手本としてちょうどよいでしょう。

## 実行時に登録する {#registering-at-runtime}

コンテナから依存を受け取る必要があるドライバーは、`AppServiceProvider` でファクトリーを登録します。

```php
// app/Providers/AppServiceProvider.php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

`$config` には `sms.providers` 内のそのドライバーの設定が渡されます。この方法で登録したドライバーは、Octane 上でも、キューワーカーの中でも、`Sms::fake()` と組み合わせても問題なく動きます。

## 最小限の実装 {#the-minimum}

`MrRijal\LaravelSms\Contracts\SmsProvider` を実装したクラスなら、どれでもドライバーとして使えます。必要なメソッドは 1 つだけです。

```php
public function send(SmsMessage $message): SmsResult;
```

受け付けられた宛先を返し、失敗したときは `DeliveryException` をスローします。`HttpDriver` を継承するかどうかは自由ですが、継承すれば面倒な境界ケースの多くを自分で書かずに済みます。

## Webhook を受け取る {#receiving-webhooks}

自作ドライバーで配信レポートを受け取るには、`MrRijal\LaravelSms\Contracts\HandlesWebhooks` を実装し、署名の検証には `VerifiesWebhooks` トレイトを使います。これで `/laravel-sms/webhook/acme` へのリクエストが `handleWebhook()` メソッドにルーティングされます。組み込みの [Termii ドライバー](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php)が実装例として参考になります。
