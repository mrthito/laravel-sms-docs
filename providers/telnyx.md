# Telnyx

<p class="lead">A developer-focused carrier running its own private network, with competitive pricing in the US.</p>

| | |
|---|---|
| Driver key | `telnyx` |
| Coverage | Global |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [telnyx.com](https://telnyx.com) |

## Configure

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| Variable | |
|---|---|
| `TELNYX_API_KEY` | API key (v2) |
| `TELNYX_FROM` | Sender number |
| `TELNYX_MESSAGING_PROFILE_ID` | Optional. Use a messaging profile and its number pool instead of one sender |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- You need either `TELNYX_FROM` or `TELNYX_MESSAGING_PROFILE_ID`.
- US numbers must be registered for 10DLC before Telnyx will deliver application-to-person traffic.
