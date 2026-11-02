# Events

<p class="lead">Four events cover a message's whole life. Use them for audit logs, analytics, rate limits, or to stop a message at the last moment.</p>

| Event | Fired | Properties |
|---|---|---|
| `SmsSending` | Before the provider is called | `message`, `provider` |
| `SmsSent` | After the provider accepted the message | `message`, `provider`, `result` |
| `SmsFailed` | After a send failed (the exception is still thrown) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | After a verified provider webhook arrives | `provider`, `payload`, `messageId`, `status`, `recipient` |

All four live in the `MrRijal\LaravelSms\Events` namespace. `provider` is the name the message was sent through. With `random` that's the provider it picked, such as `twilio`; with `failover` it's `failover`.

## Keeping an audit trail

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

::: tip Listeners can't cause duplicate sends
By the time `SmsSent` fires, the provider has the message. If one of your listeners throws, the exception goes to your error handler and the send still counts as successful. That way a queued job never sends the same text again because an audit log write failed.
:::

## Cancelling a send

Return `false` from an `SmsSending` listener and the message is not sent. `sendNow()` then returns `null`.

```php
use MrRijal\LaravelSms\Events\SmsSending;

Event::listen(function (SmsSending $event) {
    // Respect people who replied STOP.
    foreach ($event->message->getTo() as $number) {
        if (OptOut::where('phone', $number)->exists()) {
            return false;
        }
    }
});
```

The listener sees the complete message: `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()` and `getProvider()`.

## Reacting to failures

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

`getRedactedRecipientsForLogging()` masks all but the last four digits (`***4567`), so phone numbers don't pile up in your logs.

The package already writes one `error` log line for each failed send. Successful sends aren't logged: listen for `SmsSent` if you want them.
