# Termii

<p class="lead">A popular Nigerian platform with DND-compliant routes and WhatsApp delivery from the same account.</p>

| | |
|---|---|
| Driver key | `termii` |
| Coverage | Nigeria and Africa |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | No, text only |
| Delivery webhooks | Yes |
| Website | [termii.com](https://termii.com) |

## Configure

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| Variable | |
|---|---|
| `TERMII_API_KEY` | API key |
| `TERMII_SENDER_ID` | Approved sender ID |
| `TERMII_CHANNEL` | `generic` (default), `dnd` for numbers on Do-Not-Disturb, or `whatsapp` |
| `TERMII_BASE_URL` | Optional. Your account's base URL from the Termii dashboard, HTTPS only |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=termii
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Use the `dnd` channel for transactional messages such as OTPs. In Nigeria, the `generic` route doesn't reach numbers that registered for Do-Not-Disturb.
- Termii authenticates with the API key in the request body; the driver sends it over HTTPS only.

## Delivery reports

Point Termii's delivery-report URL at `https://your-app.com/laravel-sms/webhook/termii` and enable [webhooks](/guide/webhooks). Requests are verified with HMAC-SHA512 in `X-Termii-Signature`, using `TERMII_WEBHOOK_SECRET`.

Verified reports fire the `SmsWebhookReceived` event.
