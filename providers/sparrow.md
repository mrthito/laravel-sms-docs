# Sparrow SMS

<p class="lead">Nepal's most widely used SMS gateway, with direct routes to NTC and Ncell.</p>

| | |
|---|---|
| Driver key | `sparrow` |
| Coverage | Nepal |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [sparrowsms.com](https://sparrowsms.com) |

## Configure

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| Variable | |
|---|---|
| `SPARROW_TOKEN` | API token |
| `SPARROW_FROM` | Your approved identity (sender) |

Check the setup with a real message:

```bash
php artisan sms:test +9779812345678 --provider=sparrow
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+9779812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- All recipients are sent in one request.
- Write Nepali numbers with the country code (`+97798…`) or as local ten-digit mobiles (`98…`); both are accepted.
