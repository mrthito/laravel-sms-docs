# Vonage

<p class="lead">Formerly Nexmo. Strong international coverage and simple pricing, using the Vonage SMS API.</p>

| | |
|---|---|
| Driver key | `vonage` |
| Coverage | Global |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.vonage.com](https://www.vonage.com) |

## Configure

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| Variable | |
|---|---|
| `VONAGE_KEY` | API key |
| `VONAGE_SECRET` | API secret |
| `VONAGE_FROM` | Sender number or alphanumeric ID |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Messages with characters outside the GSM alphabet, such as emoji or Devanagari, are sent as Unicode automatically, so they arrive intact.
- Vonage answers with HTTP 200 even when it rejects a message. The driver reads the per-message status, so rejections still raise a `DeliveryException` with Vonage's reason.
