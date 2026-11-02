# MSG91

<p class="lead">A leading Indian gateway. Template messages use MSG91 Flows, which handle DLT registration for you.</p>

| | |
|---|---|
| Driver key | `msg91` |
| Coverage | India |
| Sending | Templates: one request for every recipient. Plain text: one request per recipient, in parallel. |
| Templates | Yes |
| Delivery webhooks | No |
| Website | [msg91.com](https://msg91.com) |

## Configure

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| Variable | |
|---|---|
| `MSG91_AUTHKEY` | Auth key |
| `MSG91_SENDER` | Six-character DLT-registered sender ID |

Check the setup with a real message:

```bash
php artisan sms:test +919812345678 --provider=msg91
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Indian regulations (DLT) require every commercial message to match a registered template. Create a Flow in MSG91, then send it with `->template($flowId, ['otp' => 4821])`. All recipients go in one request, and each receives the same variables.
- Plain-text messages use MSG91's v2 API, one recipient per request, and only reach Indian numbers if the text matches a DLT template exactly.
