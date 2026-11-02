# Composing messages

<p class="lead">Every send starts from the <code>Sms</code> facade and ends with one of four verbs. Everything in between describes the message.</p>

## The builder

Calling `Sms::to()`, `Sms::provider()`, `Sms::message()` or `Sms::template()` returns a fresh `PendingSms`. Chain what you need, then finish with a verb:

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // optional: defaults to SMS_PROVIDER
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // optional: overrides the configured sender
    ->message('Doors open at 7pm.')
    ->send();
```

| Verb | What it does | Returns |
|---|---|---|
| `send()` | Sends now, or queues when `SMS_QUEUE=true` | `SmsResult`, or `null` when queued |
| `sendNow()` | Always sends immediately | `SmsResult` (or `null` if a listener cancels) |
| `sendLater()` | Always queues | nothing |
| `sendLaterAt($when)` | Queues with a delay (`later()` is an alias) | nothing |

Because each facade call starts a new builder, two sends never share recipients or text, even inside a long-running Octane worker.

## Recipients

`to()` accepts a single number, an array, or any iterable, including a collection:

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

Each number is cleaned up and checked as you add it:

- Spaces, dashes, dots and parentheses are removed.
- What's left must be 7 to 15 digits, optionally starting with `+`. Anything else throws an `InvalidMessageException` straight away, rather than failing later at the provider.
- Duplicates are dropped, so the same person is never texted twice in one send.

::: tip Use E.164
Store and send numbers in international format: `+` followed by the country code and number. Some providers reject local formats outright, and others route them to the wrong country.
:::

## Text

```php
Sms::to($phone)->message('Your table is ready.');
```

Text is trimmed and must not be empty. Messages can be up to 1,600 characters. Providers split anything longer than one SMS (160 GSM characters, or 70 with emoji and other Unicode) into several parts and bill each part, so short messages are cheaper.

`content()` is an alias of `message()`, if you prefer the wording Laravel notifications use.

## Templates

Some providers send pre-approved templates instead of free text. In India, DLT regulations require them; WhatsApp requires them for business-initiated conversations.

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

Templates are supported by [MSG91](/providers/msg91), [WhatsApp](/providers/whatsapp) and [Brevo](/providers/brevo). The other providers need text: sending them a template-only message throws an `InvalidMessageException` that names the provider.

## Sender

Each provider has a configured sender, such as a number or an alphanumeric ID like `ACME`. Override it for one message with `from()`:

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

Alphanumeric senders aren't allowed everywhere. In the United States and Canada you must send from a registered number, so check your provider's rules for each country you send to.

## Choosing a provider

`provider()` sends this message through a specific provider instead of the default:

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

Two names are special: `failover` tries a chain of providers in order, and `random` picks one from a pool. Both are covered in [Failover and load balancing](/guide/failover).

## Conditional parts

`PendingSms` supports Laravel's `when()` and `unless()`:

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## Building a message ahead of time

`SmsMessage` is a plain object you can build, pass around and send later:

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## Macros

Give recurring messages a name of their own:

```php
// In a service provider's boot() method
Sms::macro('sendOtp', function (string $phone, int $code) {
    return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
});

// Anywhere
Sms::sendOtp($user->phone, 4821);
```
