# Events

<p class="lead">Four events cover a message's whole life. Use them for audit logs, analytics, opt-out lists, or to stop a message at the last moment.</p>

| Event | Fired | Properties |
|---|---|---|
| `SmsSending` | Before the provider is called | `message`, `provider` |
| `SmsSent` | After the provider accepted the message | `message`, `provider`, `result` |
| `SmsFailed` | After a send failed (the exception is still thrown) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | After a verified provider webhook arrives | `provider`, `payload`, `messageId`, `status`, `recipient` |

All four live in the `MrRijal\LaravelSms\Events` namespace. `provider` is the name the message was sent through. With `random` that's the provider it picked, such as `twilio`; with `failover` it's `failover`.

## Writing a listener

Since Laravel 11, listeners register themselves. Generate one, type-hint the event in `handle()`, and Laravel wires it up: no service provider and no `$listen` array.

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

Laravel scans `app/Listeners`, finds `handle(SmsSent $event)`, and registers the listener for that event. Check what it found with:

```bash
php artisan event:list --event=SmsSent
```

In production, `php artisan optimize` caches the discovered listeners along with your config and routes.

::: tip Listeners can't cause duplicate sends
By the time `SmsSent` fires, the provider has the message. If one of your listeners throws, the exception goes to your error handler and the send still counts as successful. That way a queued job never sends the same text again because an audit log write failed.
:::

### One listener, several events

Union types work too. This listener handles both outcomes:

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### Queued listeners

Writing to a database or calling an analytics API shouldn't slow a send down. Implement `ShouldQueue` and the listener runs on your queue:

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

On Laravel 13 you can pick the queue with an attribute:

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## Cancelling a send

Return `false` from an `SmsSending` listener and the message is not sent. `sendNow()` then returns `null`.

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // People who replied STOP don't hear from us again.
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

Return `null` (or nothing) to let the message through. Only an explicit `false` cancels.

::: warning Keep this listener synchronous
A cancelling listener must not implement `ShouldQueue`. A queued listener runs after the message has already gone, so it has nothing left to cancel.
:::

The listener sees the complete message: `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()` and `getProvider()`.

## Reacting to failures

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

`getRedactedRecipientsForLogging()` masks all but the last four digits (`***4567`), so phone numbers don't pile up in your logs.

The package already writes one `error` log line for each failed send. Successful sends aren't logged: add an `SmsSent` listener if you want them.

## Closure listeners

For a quick one-off, a closure in `AppServiceProvider::boot()` works too:

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

Listener classes are easier to test and to queue, so prefer them for anything you'll keep.

## Testing your listeners

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

`Sms::fake()` fires `SmsSending` and `SmsSent` just like a real send, so you can also test listeners end to end. See [Testing](/guide/testing).
