# ClickSend

<p class="lead">Popular in Australia, the UK and the US, with a clean dashboard and per-message status in every response.</p>

| | |
|---|---|
| Driver key | `clicksend` |
| Coverage | Global |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.clicksend.com](https://www.clicksend.com) |

## Configure

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| Variable | |
|---|---|
| `CLICKSEND_USERNAME` | Your ClickSend username |
| `CLICKSEND_API_KEY` | API key from the dashboard |
| `CLICKSEND_FROM` | Optional sender. Leave empty to use ClickSend's shared numbers |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- ClickSend reports each recipient separately. If some are rejected, you get a `DeliveryException` listing exactly those numbers, and a `partial` result for the rest.
