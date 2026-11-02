# SendPulse

<p class="lead">A multichannel marketing platform, popular in Europe and Latin America. Authenticates with OAuth 2.0 and sends every recipient in one request.</p>

| | |
|---|---|
| Driver key | `sendpulse` |
| Coverage | Global |
| Sending | One request for every recipient. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [sendpulse.com](https://sendpulse.com) |

## Configure

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| Variable | |
|---|---|
| `SENDPULSE_CLIENT_ID` | REST API ID |
| `SENDPULSE_CLIENT_SECRET` | REST API secret |
| `SENDPULSE_SENDER` | Approved sender name (up to 11 characters) |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Access tokens are cached for about an hour and refreshed automatically.
- Sender names need approval in the SendPulse dashboard before they can be used.
