# Testing

<p class="lead">Tests should never text a real phone. Fake the facade, run your code, then assert on what would have been sent.</p>

## Faking sends

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

`Sms::fake()` works anywhere the package sends: the facade, notifications, the `HasSms` trait and queued jobs.

## Available assertions

| Assertion | Passes when |
|---|---|
| `assertSent($callback)` | At least one sent message matches the callback |
| `assertSent($count)` | Exactly `$count` messages were sent |
| `assertSentTo($number, $callback = null)` | A message went to `$number`, written in any format |
| `assertNotSent($callback = null)` | No sent message matches |
| `assertNothingSent()` | Nothing was sent at all |
| `assertSentCount($count)` | Exactly `$count` messages were sent |
| `assertQueued($callback or $count)` | A message was queued, or exactly `$count` were (one per recipient) |
| `assertNothingQueued()` | Nothing was queued |

To inspect messages yourself, `Sms::sent()` and `Sms::queued()` return collections of `SmsMessage`.

## It behaves like the real thing

The fake doesn't call providers, but it does everything up to that point:

- Messages are validated, so an invalid number still fails your test.
- Provider names are checked: `Sms::provider('twillio')` throws, just like in production.
- `SmsSending` and `SmsSent` fire, so you can test your listeners, including a listener that cancels a send.
- Drivers registered with `Sms::extend()` keep working.
- Each message is recorded as it was at the moment it was sent, even if your code changes it afterwards.

## Testing a driver

To test a provider integration, including your own [custom driver](/guide/custom-drivers), fake the HTTP layer instead. Every HTTP driver uses Laravel's HTTP client, so `Http::fake()` intercepts its requests:

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

Add `Http::preventStrayRequests()` to make sure nothing slips through to a real API.

::: info Amazon SNS
The SNS driver uses the AWS SDK rather than Laravel's HTTP client, so `Http::fake()` doesn't reach it. Pass a mocked `SnsClient` to the driver instead: `new AwsSnsDriver($config, $snsClient)`.
:::
