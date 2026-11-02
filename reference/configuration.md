# Configuration

<p class="lead">Everything in <code>config/sms.php</code>, and the environment variable that sets it. Publish the file with <code>php artisan vendor:publish --tag=sms-config</code>; you'll rarely need to edit it.</p>

## Sending

| Option | Environment | Default | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | Provider used when a message doesn't name one. Also accepts `failover` and `random`. |
| `random_drivers` | — | `['twilio', 'msg91']` | The pool `random` picks from. |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | Comma-separated chain for `failover`, tried in order. |

## Queueing

| Option | Environment | Default | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | When `true`, `send()` queues instead of sending immediately. |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | your default | Queue connection for SMS jobs. |
| `queue_name` | `SMS_QUEUE_NAME` | your default | Queue name for SMS jobs. |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | Attempts per recipient before a job fails. |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | Seconds a job may run. Keep your queue's `retry_after` above this. |
| `retry.backoff` | — | `[10, 30, 60]` | Seconds to wait before each retry. |

## HTTP

| Option | Environment | Default | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | Seconds to wait for a provider's response. |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | Seconds to wait for a connection. |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | Parallel requests for per-recipient providers. |

## Webhooks

| Option | Environment | Default | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | Registers the webhook route. |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | URL prefix; the provider key is appended. |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | Middleware applied to the route. |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | Meta app secret. |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | Token for Meta's subscription check. |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | Passed as `?token=` in the callback URL. |

## Drivers and providers

Two maps connect a provider key to its code and its credentials:

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

`drivers` decides which class handles a key, and `providers` holds that key's settings, which are passed to the class. Each [provider page](/providers/) lists its settings.

To run the same provider with two accounts, say a transactional and a marketing account, register the class twice under different keys:

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## Config caching

The configuration contains no closures, so `php artisan config:cache` works as usual. After changing `.env` in production, run it again.
