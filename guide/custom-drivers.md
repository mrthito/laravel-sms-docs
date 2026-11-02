# Custom drivers

<p class="lead">If your provider isn't built in, a driver is one small class. The base class handles timeouts, concurrency, partial failures and safe error messages, so you only describe the provider's API.</p>

## A complete driver

Here's a driver for a fictional provider, Acme, that takes one recipient per request:

```php
namespace App\Sms;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use MrRijal\LaravelSms\Drivers\HttpDriver;
use MrRijal\LaravelSms\SentMessage;
use MrRijal\LaravelSms\SmsMessage;
use MrRijal\LaravelSms\SmsResult;

class AcmeDriver extends HttpDriver
{
    protected string $label = 'Acme';

    protected function validateConfig(): void
    {
        $this->require('api_key', 'from');
    }

    public function send(SmsMessage $message): SmsResult
    {
        $text = $this->text($message);

        return $this->sendEach(
            $message,
            fn (PendingRequest $request, string $to) => $request
                ->withToken($this->value('api_key'))
                ->post('https://api.acme.test/v1/messages', [
                    'to' => $to,
                    'from' => $this->sender($message),
                    'text' => $text,
                ]),
            function (Response $response, string $to): SentMessage {
                if (! $response->successful()) {
                    $this->fail($response, 'error.message');
                }

                return new SentMessage($to, $this->jsonString($response, 'id'), 'accepted');
            },
        );
    }
}
```

Register it in `config/sms.php`:

```php
'drivers' => [
    // …
    'acme' => App\Sms\AcmeDriver::class,
],

'providers' => [
    // …
    'acme' => [
        'api_key' => env('ACME_API_KEY'),
        'from' => env('ACME_FROM'),
    ],
],
```

And it works like any built-in provider: `Sms::provider('acme')`, failover chains, queueing, `php artisan sms:test --provider=acme`.

## What the base class gives you

| Method | Use it to |
|---|---|
| `require('key', …)` | Fail fast with "Acme configuration is incomplete" when settings are missing |
| `value('key')` | Read a required setting as a trimmed string |
| `string('key', $default)` / `bool('key')` | Read optional settings |
| `oneOf('key', [...], $default)` | Accept only known values, such as a region |
| `httpsUrl('key', $default)` | Accept a base URL only if it uses HTTPS |
| `text($message)` | Get the text, or reject template-only messages with a clear error |
| `sender($message)` | The message's `from()`, falling back to the configured sender |
| `sendEach(…)` | One request per recipient, run concurrently, with partial-failure tracking |
| `sendOnce(…)` | One request for every recipient, for providers with a bulk endpoint |
| `fail($response, 'json.path')` | Throw a `DeliveryException` with the provider's reason, cut to 200 characters |
| `jsonString($response, 'path')` | Read a string (or integer) from the response body |
| `cachedToken($clientId, fn () => …)` | Fetch an OAuth token and cache it until shortly before it expires |

Requests built by the base class already have timeouts, a JSON `Accept` header and a `User-Agent`, and they show up in `Http::fake()` like any other request.

## Bulk endpoints

If the provider accepts many recipients in one call, use `sendOnce()` and build the result yourself:

```php
return $this->sendOnce(
    $message,
    fn (PendingRequest $request) => $request
        ->withToken($this->value('api_key'))
        ->post('https://api.acme.test/v1/batches', [
            'to' => $message->getTo(),
            'text' => $this->text($message),
        ]),
    function (Response $response) use ($message): SmsResult {
        if ($response->status() !== 201) {
            $this->fail($response, 'error');
        }

        return SmsResult::accepted($message->getTo(), $this->jsonString($response, 'batch_id'));
    },
);
```

If the provider reports each recipient separately, throw a `DeliveryException` with `failedRecipients` and a `partial` result for the ones it accepted. [ClickSend's driver](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php) is a good example to copy.

## Registering at runtime

For drivers that need dependencies from the container, register a factory in `AppServiceProvider`:

```php
// app/Providers/AppServiceProvider.php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

`$config` is the driver's entry from `sms.providers`. Drivers registered this way keep working under Octane, in queue workers and with `Sms::fake()`.

## The minimum

Any class implementing `MrRijal\LaravelSms\Contracts\SmsProvider` is a valid driver. It needs one method:

```php
public function send(SmsMessage $message): SmsResult;
```

Return the accepted recipients, and throw a `DeliveryException` for failures. Extending `HttpDriver` is optional, but it saves a lot of edge cases.

## Receiving webhooks

To accept delivery reports for your driver, implement `MrRijal\LaravelSms\Contracts\HandlesWebhooks` and use the `VerifiesWebhooks` trait for signature checks. Requests to `/laravel-sms/webhook/acme` are then routed to your `handleWebhook()` method. The built-in [Termii driver](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php) shows the pattern.
