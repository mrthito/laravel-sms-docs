# Bird

<p class="lead">The company formerly known as MessageBird. This driver uses Bird's current SMS API with workspace API keys.</p>

| | |
|---|---|
| Driver key | `bird` |
| Coverage | Global |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [bird.com](https://bird.com) |

## Configure

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| Variable | |
|---|---|
| `BIRD_API_KEY` | Workspace API key, starting with `bk_` |
| `BIRD_FROM` | Sender number or alphanumeric ID |
| `BIRD_REGION` | `us1` (default) or `eu1`; must match your key |
| `BIRD_CATEGORY` | `transactional` (default), `marketing`, `authentication` or `service` |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=bird
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Keys are tied to a region: a `bk_eu1_…` key only works with `BIRD_REGION=eu1`.
- Set `BIRD_CATEGORY` honestly. Several countries apply different rules, and different pricing, to marketing traffic.
- Legacy MessageBird `AccessKey` credentials are not supported; create a workspace key in the Bird dashboard.
