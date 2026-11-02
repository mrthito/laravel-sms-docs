# Bandwidth

<p class="lead">A US carrier that owns its network, used by many of the large communication platforms. Authenticates with OAuth 2.0.</p>

| | |
|---|---|
| Driver key | `bandwidth` |
| Coverage | United States and Canada |
| Sending | One request per recipient, sent [in parallel](/guide/performance). |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [www.bandwidth.com](https://www.bandwidth.com) |

## Configure

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| Variable | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | Account ID |
| `BANDWIDTH_APPLICATION_ID` | Messaging application linked to your number |
| `BANDWIDTH_CLIENT_ID` | OAuth client ID |
| `BANDWIDTH_CLIENT_SECRET` | OAuth client secret |
| `BANDWIDTH_FROM` | A Bandwidth number assigned to that application |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- The driver exchanges your client ID and secret for an access token and caches it for about an hour. If the token is rejected early, it's discarded and the next send fetches a new one.
- Recipients are sent individually on purpose: Bandwidth treats several numbers in one request as a group conversation, where everyone sees each other's replies.
