# Environment variables

<p class="lead">Every setting the package reads from <code>.env</code>, in one place. Copy the block for your provider, fill in the values, and run <code>php artisan sms:test</code> to check them.</p>

## How it fits together {#how-it-fits-together}

`config/sms.php` reads every value with `env()`, so you configure the package entirely from `.env`. A few rules make that painless:

- **Only set what you use.** A provider's variables are read only when you send through that provider. Unused providers need nothing.
- **Quote values with spaces or `#`.** `TWILIO_FROM="ACME Alerts"`, not `TWILIO_FROM=ACME Alerts`.
- **Cache in production.** After changing `.env` on a server, run `php artisan config:cache`, or the old values stay in effect.
- **Keep secrets out of git.** Commit a `.env.example` with empty values, never the real `.env`. On Laravel Cloud, Forge or Vapor, set them in the environment settings instead.

## General settings {#general-settings}

These apply to every provider. All are optional.

```ini [.env]
# Which provider sends by default: a provider key, "failover" or "random"
SMS_PROVIDER=twilio

# Failover chain, tried left to right (used when SMS_PROVIDER=failover)
SMS_FAILOVER_DRIVERS=twilio,vonage

# Queue every send() instead of sending immediately
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # keep your queue's retry_after above this

# Provider HTTP calls
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # parallel requests for per-recipient providers

# Log driver (development only)
SMS_LOG_CHANNEL=
```

See [Configuration](/reference/configuration) for what each one does in detail.

## Global providers {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID, starts with AC
TWILIO_TOKEN=                  # Auth token
TWILIO_FROM=                   # Sender number or alphanumeric ID
TWILIO_MESSAGING_SERVICE_SID=  # Optional. Use a Messaging Service instead of a single sender (starts with MG)
```

[Twilio guide →](/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # API key
VONAGE_SECRET=  # API secret
VONAGE_FROM=    # Sender number or alphanumeric ID
```

[Vonage guide →](/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # Service plan ID from the SMS dashboard
SINCH_API_TOKEN=        # API token for that service plan
SINCH_FROM=             # Sender number or alphanumeric ID
SINCH_REGION=           # us (default), eu, au, br or ca; must match where your account lives
```

[Sinch guide →](/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # Workspace API key, starting with bk_
BIRD_FROM=      # Sender number or alphanumeric ID
BIRD_REGION=    # us1 (default) or eu1; must match your key
BIRD_CATEGORY=  # transactional (default), marketing, authentication or service
```

[Bird guide →](/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth token
PLIVO_FROM=          # Sender number or alphanumeric ID
PLIVO_LOG_MESSAGES=  # Optional, default false. Whether Plivo stores message content and numbers in its logs
```

[Plivo guide →](/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # API key (v2)
TELNYX_FROM=                  # Sender number
TELNYX_MESSAGING_PROFILE_ID=  # Optional. Use a messaging profile and its number pool instead of one sender
```

[Telnyx guide →](/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # API key
INFOBIP_SENDER=    # Sender number or alphanumeric ID
INFOBIP_BASE_URL=  # Your personal base URL from the Infobip portal, such as https://xyz123.api.infobip.com
```

[Infobip guide →](/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # Your ClickSend username
CLICKSEND_API_KEY=   # API key from the dashboard
CLICKSEND_FROM=      # Optional sender. Leave empty to use ClickSend's shared numbers
```

[ClickSend guide →](/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # API key of a One API integration
CLICKATELL_FROM=     # Optional sender, where your account has one approved
```

[Clickatell guide →](/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # API key (v3)
BREVO_SMS_SENDER=  # Sender name (up to 11 characters) or number
BREVO_SMS_TYPE=    # transactional (default) or marketing
```

[Brevo guide →](/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # Account ID
BANDWIDTH_APPLICATION_ID=  # Messaging application linked to your number
BANDWIDTH_CLIENT_ID=       # OAuth client ID
BANDWIDTH_CLIENT_SECRET=   # OAuth client secret
BANDWIDTH_FROM=            # A Bandwidth number assigned to that application
```

[Bandwidth guide →](/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # REST API ID
SENDPULSE_CLIENT_SECRET=  # REST API secret
SENDPULSE_SENDER=         # Approved sender name (up to 11 characters)
```

[SendPulse guide →](/providers/sendpulse)

### Amazon SNS {#aws-sns}

Needs the AWS SDK first: `composer require aws/aws-sdk-php`.

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # Region to send from, such as us-east-1
AWS_ACCESS_KEY_ID=      # Optional. Omit to use the default credential chain
AWS_SECRET_ACCESS_KEY=  # Optional, with the key above
AWS_SNS_SENDER_ID=      # Optional alphanumeric sender ID
AWS_SNS_SMS_TYPE=       # Transactional (default) or Promotional
```

[Amazon SNS guide →](/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # Phone number ID from the WhatsApp Manager
WHATSAPP_ACCESS_TOKEN=          # A permanent system-user access token
WHATSAPP_API_VERSION=           # Optional, default v21.0
WHATSAPP_TEMPLATE_LANGUAGE=     # Optional, default en. Language code of your templates, such as en_US
WHATSAPP_DEFAULT_COUNTRY_CODE=  # Optional. Added to numbers written without a country code
```

[WhatsApp guide →](/providers/whatsapp)

## Regional providers {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth key
MSG91_SENDER=   # Six-character DLT-registered sender ID
```

[MSG91 guide →](/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # API token
SPARROW_FROM=   # Your approved identity (sender)
```

[Sparrow SMS guide →](/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # API key
TERMII_SENDER_ID=  # Approved sender ID
TERMII_CHANNEL=    # generic (default), dnd for numbers on Do-Not-Disturb, or whatsapp
TERMII_BASE_URL=   # Optional. Your account's base URL from the Termii dashboard, HTTPS only
```

[Termii guide →](/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # Public access key
SENDCHAMP_SENDER_NAME=  # Approved sender name
SENDCHAMP_ROUTE=        # dnd (default), non_dnd or international
```

[Sendchamp guide →](/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # API key
AFRICASTALKING_USERNAME=  # App username (sandbox while testing)
AFRICASTALKING_FROM=      # Optional sender ID or short code
AFRICASTALKING_SANDBOX=   # true to use the sandbox API
```

[Africa's Talking guide →](/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # API token ID
BULKSMS_TOKEN_SECRET=  # API token secret
BULKSMS_FROM=          # Optional sender, where your account has one
```

[BulkSMS guide →](/providers/bulksms)

## Webhook secrets {#webhook-secrets}

Only needed if you receive delivery reports. Each one is required for its provider: without it, that provider's webhooks are rejected. See [Webhooks](/guide/webhooks).

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # any random string; also entered in the Meta dashboard
WHATSAPP_WEBHOOK_SECRET=        # your Meta app secret
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # also added to the callback URL as ?token=
```

Generate secrets you choose yourself with `php -r "echo bin2hex(random_bytes(24));"`.

## A complete example {#a-complete-example}

A realistic production setup: Twilio first, Vonage as backup, everything queued, and WhatsApp delivery reports.

```ini [.env]
SMS_PROVIDER=failover
SMS_FAILOVER_DRIVERS=twilio,vonage

SMS_QUEUE=true
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=ACME

SMS_WEBHOOKS_ENABLED=true
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_WEBHOOK_SECRET=
```

Then check each provider in the chain:

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
