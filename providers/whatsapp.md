# WhatsApp

<p class="lead">Send WhatsApp messages through Meta's Cloud API with the same API you use for SMS. Supports free-form text and approved templates.</p>

| | |
|---|---|
| Driver key | `whatsapp` |
| Coverage | Global |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | Yes |
| Delivery webhooks | Yes |
| Website | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## Configure

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| Variable | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID from the WhatsApp Manager |
| `WHATSAPP_ACCESS_TOKEN` | A permanent system-user access token |
| `WHATSAPP_API_VERSION` | Optional, default `v21.0` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Optional, default `en`. Language code of your templates, such as `en_US` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | Optional. Added to numbers written without a country code |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- WhatsApp only allows free-form text within 24 hours of the customer's last message. To start a conversation, send an approved template: `->template('order_update', ['Ana', '#4821'])`. Variables fill the template's body parameters in order.
- Use a system-user token, not the temporary token from the getting-started page, which expires after a day.

## Delivery reports

Point WhatsApp's delivery-report URL at `https://your-app.com/laravel-sms/webhook/whatsapp` and enable [webhooks](/guide/webhooks). Requests are verified with an `X-Hub-Signature-256` HMAC (`WHATSAPP_WEBHOOK_SECRET`), and Meta's subscription check uses `WHATSAPP_VERIFY_TOKEN`.

Verified reports fire the `SmsWebhookReceived` event.
