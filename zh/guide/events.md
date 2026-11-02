# 事件

<p class="lead">四个事件覆盖了一条短信的完整生命周期。可以用它们做审计日志、数据统计、频率限制，或者在最后一刻拦下一条短信。</p>

| 事件 | 触发时机 | 属性 |
|---|---|---|
| `SmsSending` | 调用服务商之前 | `message`、`provider` |
| `SmsSent` | 服务商接收短信之后 | `message`、`provider`、`result` |
| `SmsFailed` | 发送失败之后（异常照常抛出） | `message`、`provider`、`exception` |
| `SmsWebhookReceived` | 收到一条通过验证的服务商 Webhook 之后 | `provider`、`payload`、`messageId`、`status`、`recipient` |

这四个事件都位于 `MrRijal\LaravelSms\Events` 命名空间下。`provider` 是这条短信实际使用的名称：用 `random` 时，是它挑中的那家服务商，比如 `twilio`；用 `failover` 时，就是 `failover`。

## 记录审计日志 {#keeping-an-audit-trail}

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

::: tip 监听器不会导致重复发送
`SmsSent` 触发时，服务商已经拿到了这条短信。即使某个监听器抛出异常，异常也只会交给你的错误处理器，这次发送仍算成功。这样，队列任务就不会因为一次审计日志写入失败而把同样的内容再发一遍。
:::

## 取消发送 {#cancelling-a-send}

在 `SmsSending` 监听器中返回 `false`，这条短信就不会发出，`sendNow()` 随后返回 `null`。

```php
use MrRijal\LaravelSms\Events\SmsSending;

Event::listen(function (SmsSending $event) {
    // 尊重回复了 STOP（退订）的用户。
    foreach ($event->message->getTo() as $number) {
        if (OptOut::where('phone', $number)->exists()) {
            return false;
        }
    }
});
```

监听器能看到完整的短信：`getTo()`、`getText()`、`getTemplateId()`、`getVariables()`、`getFrom()` 和 `getProvider()`。

## 处理发送失败 {#reacting-to-failures}

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

`getRedactedRecipientsForLogging()` 只保留号码的最后四位，其余全部打码（`***4567`），日志里就不会堆满手机号。

每次发送失败，扩展包本身已经会写一行 `error` 级别的日志。发送成功则不记日志；需要的话，请监听 `SmsSent`。
