# Clickatell

<p class="lead">A long-standing gateway with deep coverage across Africa and emerging markets. Uses the Clickatell One API.</p>

| | |
|---|---|
| Driver key | `clickatell` |
| Coverage | Global |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.clickatell.com](https://www.clickatell.com) |

## Configure

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| Variable | |
|---|---|
| `CLICKATELL_API_KEY` | API key of a One API integration |
| `CLICKATELL_FROM` | Optional sender, where your account has one approved |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Clickatell accepts up to 100 recipients per request; larger sends are split into batches automatically.
- Each recipient is accepted or rejected individually, and rejections are reported per number.
