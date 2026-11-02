# Africa's Talking

<p class="lead">Direct operator connections across more than 20 African countries, with a free sandbox for development.</p>

| | |
|---|---|
| Driver key | `africastalking` |
| Coverage | Pan-Africa |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | Yes |
| Website | [africastalking.com](https://africastalking.com) |

## Configure

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| Variable | |
|---|---|
| `AFRICASTALKING_API_KEY` | API key |
| `AFRICASTALKING_USERNAME` | App username (`sandbox` while testing) |
| `AFRICASTALKING_FROM` | Optional sender ID or short code |
| `AFRICASTALKING_SANDBOX` | `true` to use the sandbox API |

Check the setup with a real message:

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- In sandbox mode, messages appear in the Africa's Talking simulator instead of on real phones. Set `AFRICASTALKING_USERNAME=sandbox` and `AFRICASTALKING_SANDBOX=true` together.
- Africa's Talking reports each recipient's status. Rejected numbers, for example for insufficient balance, are listed in the `DeliveryException`.

## Delivery reports

Point Africa's Talking's delivery-report URL at `https://your-app.com/laravel-sms/webhook/africastalking` and enable [webhooks](/guide/webhooks). Requests are verified with a `?token=` secret in the callback URL, using `AFRICASTALKING_WEBHOOK_SECRET` (Africa's Talking doesn't sign callbacks).

Verified reports fire the `SmsWebhookReceived` event.
