# Installation

<p class="lead">One Composer command and a few lines of <code>.env</code>. The service provider and the <code>Sms</code> facade register themselves.</p>

## Install the package

```bash
composer require mr-rijal/laravel-sms
```

Then publish the configuration file. You'll want it once you add a second provider or change the defaults.

```bash
php artisan vendor:publish --tag=sms-config
```

This creates `config/sms.php`. Everything in it reads from environment variables, so most projects never edit the file itself.

## Choose a provider

Set your default provider and its credentials. With Twilio, for example:

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

Each provider page lists exactly which variables it needs. Start from the [provider overview](/providers/) if you haven't picked one yet.

::: tip Developing locally?
Leave `SMS_PROVIDER` unset. The default is the `log` driver, which writes each message to your Laravel log instead of sending it, so nothing reaches a real phone by accident.
:::

## Check that it works

Send a real message from the terminal. This uses exactly the same code path as your application:

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

If something is wrong, the command tells you what the provider said, for example `Failed to send SMS via Twilio (HTTP 401): Authenticate`. Try a specific provider with `--provider=sinch`, or your own text with `--message="Hello"`.

`php artisan about` also gains a **Laravel SMS** section showing your default provider, and whether queueing and webhooks are on.

## Optional: Amazon SNS

The AWS SDK is large, so it isn't installed unless you need it. If you'll use the [Amazon SNS](/providers/aws-sns) driver:

```bash
composer require aws/aws-sdk-php
```

## Next steps

[Send your first message →](/guide/quick-start)
