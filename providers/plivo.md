# Plivo

<p class="lead">A cost-effective global provider with a simple REST API. Sends every recipient in one request.</p>

| | |
|---|---|
| Driver key | `plivo` |
| Coverage | Global |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.plivo.com](https://www.plivo.com) |

## Configure

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| Variable | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth token |
| `PLIVO_FROM` | Sender number or alphanumeric ID |
| `PLIVO_LOG_MESSAGES` | Optional, default `false`. Whether Plivo stores message content and numbers in its logs |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Plivo's own content logging is **off** by default here, so message text isn't retained in their dashboard. Turn it on only if you need it for debugging.
- Each recipient gets its own Plivo message UUID, in the same order as your recipients.
