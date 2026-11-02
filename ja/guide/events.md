# イベント

<p class="lead">メッセージの一生は 4 つのイベントでカバーされています。監査ログ、分析、レート制限に使えるほか、送信を直前で止めることもできます。</p>

| イベント | 発火するタイミング | プロパティ |
|---|---|---|
| `SmsSending` | プロバイダーを呼び出す前 | `message`, `provider` |
| `SmsSent` | プロバイダーがメッセージを受け付けた後 | `message`, `provider`, `result` |
| `SmsFailed` | 送信が失敗した後（例外はそのままスローされる） | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | 検証済みのプロバイダーの Webhook を受信した後 | `provider`, `payload`, `messageId`, `status`, `recipient` |

4 つとも `MrRijal\LaravelSms\Events` 名前空間にあります。`provider` には、メッセージの送信に使われた名前が入ります。`random` の場合は選ばれたプロバイダー（たとえば `twilio`）、`failover` の場合は `failover` です。

## 監査ログを残す {#keeping-an-audit-trail}

```php
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

Event::listen(function (SmsSent $event) {
    foreach ($event->result->messages as $sent) {
        SmsLog::create([
            'provider' => $event->provider,
            'to' => $sent->to,
            'provider_id' => $sent->id,
            'status' => $sent->status,
        ]);
    }
});
```

::: tip リスナーが原因で重複送信されることはない
`SmsSent` が発火した時点で、メッセージはすでにプロバイダーに渡っています。リスナーのどれかが例外をスローしても、その例外はエラーハンドラーに送られ、送信自体は成功として扱われます。監査ログの書き込みに失敗したせいで、キューのジョブが同じメッセージをもう一度送ってしまうことはありません。
:::

## 送信を取り消す {#cancelling-a-send}

`SmsSending` リスナーから `false` を返すと、メッセージは送信されません。その場合、`sendNow()` は `null` を返します。

```php
use MrRijal\LaravelSms\Events\SmsSending;

Event::listen(function (SmsSending $event) {
    // STOP と返信した人には送らない
    foreach ($event->message->getTo() as $number) {
        if (OptOut::where('phone', $number)->exists()) {
            return false;
        }
    }
});
```

リスナーからはメッセージの内容をすべて参照できます：`getTo()`、`getText()`、`getTemplateId()`、`getVariables()`、`getFrom()`、`getProvider()`。

## 失敗に対応する {#reacting-to-failures}

```php
use MrRijal\LaravelSms\Events\SmsFailed;

Event::listen(function (SmsFailed $event) {
    Log::warning('SMS failed', [
        'provider' => $event->provider,
        'recipients' => $event->message->getRedactedRecipientsForLogging(),
        'error' => $event->exception->getMessage(),
    ]);
});
```

`getRedactedRecipientsForLogging()` は下 4 桁以外をマスクする（`***4567`）ので、ログに電話番号がたまっていくことはありません。

パッケージは、送信が失敗するたびに `error` レベルのログを 1 行書き出します。成功した送信はログに残しません。必要なら `SmsSent` をリッスンしてください。
