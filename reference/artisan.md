# Artisan commands

## sms:test

Sends a real message to check your credentials, using the same code path as your application.

```bash
php artisan sms:test {to} [--provider=] [--message=]
```

| | |
|---|---|
| `to` | Recipient, ideally in E.164 format: `+15551234567` |
| `--provider` | Provider key to use. Defaults to `SMS_PROVIDER`. |
| `--message` | Text to send. Defaults to a short test message. |

```bash
php artisan sms:test +15551234567 --provider=sinch --message="Hello from production"
```

On success it prints the provider and the message ID. On failure it prints the provider's reason and exits with a non-zero status, so you can use it in deploy scripts and health checks.

::: warning It sends a real message
And your provider charges for it. Use your own number.
:::

## about

Laravel's `php artisan about` command includes a **Laravel SMS** section:

```text
  Laravel SMS ............................................................
  Default provider ................................................. twilio
  Queue .......................................................... disabled
  Webhooks ........................................................ enabled
```
