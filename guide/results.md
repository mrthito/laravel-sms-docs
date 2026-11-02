# Results and errors

<p class="lead">A text message is only useful if it arrives. Every send tells you what the provider accepted and, when something goes wrong, exactly which recipients were affected.</p>

## The result

`sendNow()` returns an `SmsResult`:

```php
$result = Sms::to(['+15551234567', '+15557654321'])
    ->message('Hi')
    ->sendNow();

$result->provider;      // "twilio"
$result->recipients();  // ["+15551234567", "+15557654321"]
$result->ids();         // ["SM1a…", "SM2b…"]
$result->firstId();     // "SM1a…"
count($result);         // 2

foreach ($result->messages as $sent) {
    $sent->to;      // "+15551234567"
    $sent->id;      // "SM1a…"
    $sent->status;  // "queued", as the provider reported it
}
```

Store the message ID. It's the key for the provider's delivery reports, for support tickets ("where's message SM1a…?"), and for matching [webhooks](/guide/webhooks) to the message that triggered them.

::: info Accepted, not delivered
A result means the provider **accepted** the message. Delivery to the handset happens a few seconds later, and can still fail if the phone is off or the number has changed. Use [webhooks](/guide/webhooks) to track final delivery.
:::

`sendNow()` returns `null` in exactly one case: an [`SmsSending` listener](/guide/events#cancelling-a-send) cancelled the send. `send()` also returns `null` when it queued the message instead of sending it.

## When a provider says no

A rejected or unreachable send throws a `DeliveryException`. Its message is written for humans and safe to log:

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

The provider's own explanation is included, cut to 200 characters. Your credentials never are.

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400, the HTTP status when there is one
    $e->failedRecipients;       // numbers the provider did not accept
    $e->partial?->recipients(); // numbers it did accept before failing
}
```

## Partial failures

Send to a hundred people and one number might be invalid. The package doesn't pretend the whole send failed, and it doesn't hide the one that did:

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 99 people have the message. Don't send it to them again.
        $delivered = $e->partial->recipients();
    }

    // Retry, flag or report just these.
    $e->failedRecipients;
}
```

The message says how many failed, too: `… (1 of 100 recipients failed)`.

This is also what makes [failover](/guide/failover) safe: the next provider only ever receives `failedRecipients`.

## Every exception the package throws

All of them implement `MrRijal\LaravelSms\Exceptions\SmsException`, so one `catch` covers the package:

| Exception | Extends | Thrown when |
|---|---|---|
| `DeliveryException` | `RuntimeException` | A provider rejected the message, couldn't be reached, or authentication failed |
| `InvalidMessageException` | `InvalidArgumentException` | A number is malformed, the text is empty or too long, or the provider can't send this kind of message |
| `InvalidConfigurationException` | `InvalidArgumentException` | A provider is unknown, or its credentials or settings are missing or invalid |

Invalid messages and configuration fail **before** anything is sent, so you never pay for half a mistake.
