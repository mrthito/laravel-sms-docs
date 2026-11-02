# BulkSMS

<p class="lead">A straightforward global gateway that sends every recipient in one JSON request.</p>

| | |
|---|---|
| Driver key | `bulksms` |
| Coverage | Global, strongest in Southern Africa |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | Yes |
| Website | [www.bulksms.com](https://www.bulksms.com) |

## Configure

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| Variable | |
|---|---|
| `BULKSMS_TOKEN_ID` | API token ID |
| `BULKSMS_TOKEN_SECRET` | API token secret |
| `BULKSMS_FROM` | Optional sender, where your account has one |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Create a token under *Settings → API Tokens*; the driver uses it with HTTP Basic authentication.

## Delivery reports

Point BulkSMS's delivery-report URL at `https://your-app.com/laravel-sms/webhook/bulksms` and enable [webhooks](/guide/webhooks). Requests are verified with HMAC-SHA256 in `X-BulkSMS-Signature`, using `BULKSMS_WEBHOOK_SECRET`.

Verified reports fire the `SmsWebhookReceived` event.
