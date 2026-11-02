# イベント

<p class="lead">メッセージの一生は 4 つのイベントでカバーされています。監査ログ、分析、配信停止リストに使えるほか、送信を直前で止めることもできます。</p>

| イベント | 発火するタイミング | プロパティ |
|---|---|---|
| `SmsSending` | プロバイダーを呼び出す前 | `message`, `provider` |
| `SmsSent` | プロバイダーがメッセージを受け付けた後 | `message`, `provider`, `result` |
| `SmsFailed` | 送信が失敗した後（例外はそのままスローされる） | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | 検証済みのプロバイダーの Webhook を受信した後 | `provider`, `payload`, `messageId`, `status`, `recipient` |

4 つとも `MrRijal\LaravelSms\Events` 名前空間にあります。`provider` には、メッセージの送信に使われた名前が入ります。`random` の場合は選ばれたプロバイダー（たとえば `twilio`）、`failover` の場合は `failover` です。

## リスナーを書く {#writing-a-listener}

Laravel 11 以降、リスナーは自動で登録されます。リスナーを生成して `handle()` でイベントをタイプヒントすれば、あとは Laravel がつないでくれます。サービスプロバイダーも `$listen` 配列も必要ありません。

```bash
php artisan make:listener RecordSentSms --event="MrRijal\LaravelSms\Events\SmsSent"
```

```php
namespace App\Listeners;

use App\Models\SmsLog;
use MrRijal\LaravelSms\Events\SmsSent;

class RecordSentSms
{
    public function handle(SmsSent $event): void
    {
        foreach ($event->result->messages as $sent) {
            SmsLog::create([
                'provider' => $event->provider,
                'to' => $sent->to,
                'provider_id' => $sent->id,
                'status' => $sent->status,
            ]);
        }
    }
}
```

Laravel は `app/Listeners` をスキャンして `handle(SmsSent $event)` を見つけ、そのイベントのリスナーとして登録します。何が検出されたかは次のコマンドで確認できます。

```bash
php artisan event:list --event=SmsSent
```

本番環境では、`php artisan optimize` を実行すると、設定やルートと一緒に検出済みのリスナーもキャッシュされます。

::: tip リスナーが原因で重複送信されることはない
`SmsSent` が発火した時点で、メッセージはすでにプロバイダーに渡っています。リスナーのどれかが例外をスローしても、その例外はエラーハンドラーに送られ、送信自体は成功として扱われます。監査ログの書き込みに失敗したせいで、キューのジョブが同じメッセージをもう一度送ってしまうことはありません。
:::

### 1 つのリスナーで複数のイベントを扱う {#one-listener-several-events}

ユニオン型も使えます。次のリスナーは成功と失敗の両方を扱います。

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### キューで動くリスナー {#queued-listeners}

データベースへの書き込みや分析 API の呼び出しで、送信が遅くなってはいけません。`ShouldQueue` を実装すれば、リスナーはキューの上で実行されます。

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class RecordSentSms implements ShouldQueue
{
    public function handle(SmsSent $event): void
    {
        // …
    }
}
```

Laravel 13 では、属性でキューを指定できます。

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## 送信を取り消す {#cancelling-a-send}

`SmsSending` リスナーから `false` を返すと、メッセージは送信されません。その場合、`sendNow()` は `null` を返します。

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // STOP と返信した人には、二度と送らない
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

メッセージをそのまま送らせたいときは `null` を返す（または何も返さない）ようにします。送信を取り消せるのは、明示的に返した `false` だけです。

::: warning このリスナーは同期のままにする
送信を取り消すリスナーに `ShouldQueue` を実装してはいけません。キューで動くリスナーはメッセージが送られた後に実行されるので、取り消すものがもう残っていません。
:::

リスナーからはメッセージの内容をすべて参照できます：`getTo()`、`getText()`、`getTemplateId()`、`getVariables()`、`getFrom()`、`getProvider()`。

## 失敗に対応する {#reacting-to-failures}

```php
namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use MrRijal\LaravelSms\Events\SmsFailed;

class AlertOnSmsFailure
{
    public function handle(SmsFailed $event): void
    {
        Log::warning('SMS failed', [
            'provider' => $event->provider,
            'recipients' => $event->message->getRedactedRecipientsForLogging(),
            'error' => $event->exception->getMessage(),
        ]);
    }
}
```

`getRedactedRecipientsForLogging()` は下 4 桁以外をマスクする（`***4567`）ので、ログに電話番号がたまっていくことはありません。

パッケージは、送信が失敗するたびに `error` レベルのログを 1 行書き出します。成功した送信はログに残しません。必要なら `SmsSent` のリスナーを追加してください。

## クロージャーのリスナー {#closure-listeners}

ちょっとした使い捨ての処理なら、`AppServiceProvider::boot()` にクロージャーを書いてもかまいません。

```php
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

public function boot(): void
{
    Event::listen(function (SmsSent $event) {
        // …
    });
}
```

リスナークラスのほうがテストしやすく、キューにも載せやすいので、長く使うものにはクラスを選びましょう。

## リスナーをテストする {#testing-your-listeners}

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

`Sms::fake()` は本物の送信と同じように `SmsSending` と `SmsSent` を発火するので、リスナーをエンドツーエンドでテストすることもできます。詳しくは[テスト](/ja/guide/testing)を参照してください。
