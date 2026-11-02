# Brevo

<p class="lead">Formerly Sendinblue. A good fit if you already send email through Brevo and want one account for both.</p>

| | |
|---|---|
| Driver key | `brevo` |
| Coverage | Global |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | Yes |
| Delivery webhooks | No |
| Website | [www.brevo.com](https://www.brevo.com) |

## Configure

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| Variable | |
|---|---|
| `BREVO_API_KEY` | API key (v3) |
| `BREVO_SMS_SENDER` | Sender name (up to 11 characters) or number |
| `BREVO_SMS_TYPE` | `transactional` (default) or `marketing` |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Brevo SMS templates are supported: pass the template ID and its parameters with `->template('12', ['code' => 4821])`.
- Marketing messages must include an opt-out and are subject to quiet hours in some countries. Use `transactional` for codes and receipts.
