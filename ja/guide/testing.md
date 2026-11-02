# テスト

<p class="lead">テストから本物の電話に SMS を送ってはいけません。ファサードをフェイクに差し替えてコードを実行し、送信されるはずだった内容をアサートしましょう。</p>

## 送信をフェイクにする {#faking-sends}

```php
use MrRijal\LaravelSms\Facades\Sms;
use MrRijal\LaravelSms\SmsMessage;

it('sends a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567'])->assertOk();

    Sms::assertSentTo('+15551234567');
    Sms::assertSent(fn (SmsMessage $sms) => str_contains($sms->getText(), 'code'));
    Sms::assertSentCount(1);
});

it('stays quiet for unverified numbers', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15550000000']);

    Sms::assertNothingSent();
});
```

`Sms::fake()` は、ファサード、通知、`HasSms` トレイト、キューのジョブなど、パッケージが送信するあらゆる場所で効きます。

## 使えるアサーション {#available-assertions}

| アサーション | 成功する条件 |
|---|---|
| `assertSent($callback)` | 送信されたメッセージのうち、少なくとも 1 件がコールバックに一致する |
| `assertSent($count)` | ちょうど `$count` 件のメッセージが送信された |
| `assertSentTo($number, $callback = null)` | `$number` 宛てにメッセージが送信された（番号の書式は問わない） |
| `assertNotSent($callback = null)` | 一致するメッセージが 1 件も送信されていない |
| `assertNothingSent()` | 何も送信されていない |
| `assertSentCount($count)` | ちょうど `$count` 件のメッセージが送信された |
| `assertQueued($callback or $count)` | メッセージがキューに入った、またはちょうど `$count` 件キューに入った（宛先ごとに 1 件） |
| `assertNothingQueued()` | 何もキューに入っていない |

メッセージを自分で調べたいときは、`Sms::sent()` と `Sms::queued()` が `SmsMessage` のコレクションを返します。

## 本番と同じように振る舞う {#it-behaves-like-the-real-thing}

フェイクはプロバイダーを呼び出しませんが、その手前までは本番と同じ処理をすべて行います。

- メッセージはバリデーションされるので、無効な番号ならテストはきちんと失敗します。
- プロバイダー名もチェックされます。`Sms::provider('twillio')` は本番と同じように例外をスローします。
- `SmsSending` と `SmsSent` が発火するので、送信をキャンセルするリスナーも含めてリスナーをテストできます。
- `Sms::extend()` で登録したドライバーもそのまま動きます。
- 各メッセージは送信された時点の状態で記録されます。後からコードがメッセージを変更しても影響しません。

## ドライバーをテストする {#testing-a-driver}

プロバイダーとの連携をテストするときは、自作の[カスタムドライバー](/ja/guide/custom-drivers)も含め、代わりに HTTP 層をフェイクにします。HTTP を使うドライバーはどれも Laravel の HTTP クライアントを使っているので、`Http::fake()` でリクエストを横取りできます。

```php
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

Http::fake([
    'api.twilio.com/*' => Http::response(['sid' => 'SM123', 'status' => 'queued'], 201),
]);

$result = Sms::provider('twilio')->to('+15551234567')->message('Hi')->sendNow();

expect($result->firstId())->toBe('SM123');

Http::assertSent(fn (Request $request) => $request['To'] === '+15551234567');
```

`Http::preventStrayRequests()` を追加しておけば、本物の API にリクエストが漏れ出すこともありません。

::: info Amazon SNS
SNS ドライバーは Laravel の HTTP クライアントではなく AWS SDK を使うため、`Http::fake()` は効きません。代わりに、モック化した `SnsClient` をドライバーに渡してください：`new AwsSnsDriver($config, $snsClient)`。
:::
