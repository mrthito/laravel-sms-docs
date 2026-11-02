# Twilio

<p class="lead">The most widely used SMS API. Excellent deliverability in North America and Europe, with Messaging Services for sender pools and compliance.</p>

| | |
|---|---|
| Driver key | `twilio` |
| Coverage | Global |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.twilio.com](https://www.twilio.com) |

## Configure

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| Variable | |
|---|---|
| `TWILIO_SID` | Account SID, starts with `AC` |
| `TWILIO_TOKEN` | Auth token |
| `TWILIO_FROM` | Sender number or alphanumeric ID |
| `TWILIO_MESSAGING_SERVICE_SID` | Optional. Use a Messaging Service instead of a single sender (starts with `MG`) |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- You need either `TWILIO_FROM` or `TWILIO_MESSAGING_SERVICE_SID`. A Messaging Service lets Twilio choose the best number from a pool and handles opt-outs for you.
- When a message sets `from()`, that sender is used and the Messaging Service is skipped for that message.
- Trial accounts can only text numbers you have verified in the Twilio console.
