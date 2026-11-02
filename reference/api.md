# API

<p class="lead">The public classes and methods you will use day to day, on one page.</p>

## Sms facade

`MrRijal\LaravelSms\Facades\Sms` proxies to the `SmsManager`.

| Method | Returns | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | Start a message to these numbers |
| `provider(string $name)` | `PendingSms` | Start a message through a specific provider |
| `message(string $text)` | `PendingSms` | Start a message with this text |
| `template(string $id, array $vars = [])` | `PendingSms` | Start a template message |
| `compose(?SmsMessage $message = null)` | `PendingSms` | Wrap an existing message in a builder |
| `send(SmsMessage $message)` | `?SmsResult` | Send, or queue when `sms.queue` is on |
| `sendNow(SmsMessage $message)` | `?SmsResult` | Send immediately |
| `queue(SmsMessage $message, $delay = null)` | `void` | Queue one job per recipient |
| `driver(?string $name = null)` | `SmsProvider` | The driver instance for a provider |
| `extend(string $name, Closure $factory)` | `SmsManager` | Register a custom driver |
| `getDefaultDriver()` | `string` | The default provider key |
| `forgetDrivers()` | `SmsManager` | Drop cached driver instances |
| `macro(string $name, callable $macro)` | `void` | Add your own method |
| `fake()` | `SmsFake` | Replace the manager with a recording fake |

## PendingSms

Returned by the facade; every method except the four verbs returns the builder.

| Method | |
|---|---|
| `to(string\|iterable $numbers)` | Add recipients |
| `message(string $text)` / `content(string $text)` | Set the text |
| `template(string $id, array $vars = [])` | Use a provider template |
| `from(?string $sender)` | Override the sender |
| `provider(string $name)` | Choose the provider |
| `when($condition, $callback)` / `unless(…)` | Apply changes conditionally |
| `getMessage()` | The underlying `SmsMessage` |
| `send()` → `?SmsResult` | Send, or queue when `sms.queue` is on |
| `sendNow()` → `?SmsResult` | Send immediately |
| `sendLater()` | Queue |
| `sendLaterAt($when)` / `later($when)` | Queue with a delay: a date, an interval or seconds |

## SmsMessage

`MrRijal\LaravelSms\SmsMessage` holds one message. Setters return the message, so they chain.

| Method | |
|---|---|
| `SmsMessage::create(?string $text = null)` | New message, optionally with text |
| `to()`, `message()`, `content()`, `template()`, `from()`, `provider()` | As on `PendingSms` |
| `getTo()` → `list<string>` | Normalized recipients |
| `getText()`, `getTemplateId()`, `getFrom()`, `getProvider()` → `?string` | |
| `getVariables()` → `array` | Template variables |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | A copy addressed to other numbers |
| `getRedactedRecipientsForLogging()` → `list<string>` | Numbers masked to `***4567` |
| `validate()` | Throws `InvalidMessageException` if it can't be sent |

## SmsResult

| Member | |
|---|---|
| `$provider` | Provider key the message went through |
| `$messages` | `list<SentMessage>`, one per accepted recipient |
| `recipients()` → `list<string>` | Accepted numbers |
| `ids()` → `list<string>` | Distinct provider message IDs |
| `firstId()` → `?string` | The first message ID |
| `count()` | Number of accepted recipients |

`SentMessage` has three read-only properties: `$to`, `$id` and `$status`.

## Exceptions

All in `MrRijal\LaravelSms\Exceptions`, and all implement `SmsException`.

| Class | Members |
|---|---|
| `DeliveryException` | `$provider`, `$failedRecipients`, `$partial` (`?SmsResult`), `hasPartialDelivery()`, `getCode()` (the HTTP status) |
| `InvalidMessageException` | Malformed number, empty or too-long text, unsupported message type |
| `InvalidConfigurationException` | Unknown provider, missing or invalid settings |

## Contracts

| Interface | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult`: implement it to write a driver |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response`: receive provider webhooks |
| `Contracts\Factory` | Bound to the manager; type-hint it for dependency injection |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
