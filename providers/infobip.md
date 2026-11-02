# Infobip

<p class="lead">An enterprise platform with very wide operator reach, especially strong in Europe, the Middle East and Africa. Uses SMS API v3.</p>

| | |
|---|---|
| Driver key | `infobip` |
| Coverage | Global |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.infobip.com](https://www.infobip.com) |

## Configure

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| Variable | |
|---|---|
| `INFOBIP_API_KEY` | API key |
| `INFOBIP_SENDER` | Sender number or alphanumeric ID |
| `INFOBIP_BASE_URL` | Your personal base URL from the Infobip portal, such as `https://xyz123.api.infobip.com` |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Use the **personal base URL** shown on your Infobip account's homepage. Infobip routes your traffic through it, and support will ask for it.
- The base URL must use HTTPS; anything else is rejected when the driver loads.
