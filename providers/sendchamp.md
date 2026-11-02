# Sendchamp

<p class="lead">A Nigerian communications platform with DND, non-DND and international routes. Sends every recipient in one request.</p>

| | |
|---|---|
| Driver key | `sendchamp` |
| Coverage | Nigeria and Africa |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | Yes |
| Website | [sendchamp.com](https://sendchamp.com) |

## Configure

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| Variable | |
|---|---|
| `SENDCHAMP_API_KEY` | Public access key |
| `SENDCHAMP_SENDER_NAME` | Approved sender name |
| `SENDCHAMP_ROUTE` | `dnd` (default), `non_dnd` or `international` |

Check the setup with a real message:

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Keep the `dnd` route for anything time-sensitive, such as login codes; it reaches numbers that registered for Do-Not-Disturb.

## Delivery reports

Point Sendchamp's delivery-report URL at `https://your-app.com/laravel-sms/webhook/sendchamp` and enable [webhooks](/guide/webhooks). Requests are verified with HMAC-SHA256 in `X-Sendchamp-Signature`, using `SENDCHAMP_WEBHOOK_SECRET`.

Verified reports fire the `SmsWebhookReceived` event.
