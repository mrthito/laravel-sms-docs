# Sinch

<p class="lead">A carrier-grade platform with direct operator connections in many countries. Sends every recipient in one batch request.</p>

| | |
|---|---|
| Driver key | `sinch` |
| Coverage | Global |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [sinch.com](https://sinch.com) |

## Configure

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| Variable | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | Service plan ID from the SMS dashboard |
| `SINCH_API_TOKEN` | API token for that service plan |
| `SINCH_FROM` | Sender number or alphanumeric ID |
| `SINCH_REGION` | `us` (default), `eu`, `au`, `br` or `ca`; must match where your account lives |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Use the region your service plan was created in. A mismatch returns `401` even with a valid token.
- The whole batch shares one Sinch batch ID, which you get back from `$result->firstId()`.
