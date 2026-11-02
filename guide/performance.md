# Performance

<p class="lead">Sending an SMS is mostly waiting for a provider to answer. The package spends that time well: fewer requests where a provider allows it, and parallel requests where it doesn't.</p>

## Bulk providers: one request

These providers accept many recipients in one API call, so a message to 200 people is a single HTTP request:

**Sinch, Plivo, Infobip, ClickSend, Clickatell, Sparrow SMS, Sendchamp, Africa's Talking, BulkSMS, SendPulse**, and **MSG91** templates.

Clickatell allows up to 100 recipients per call, so the package splits larger sends into batches automatically.

## Per-recipient providers: in parallel

**Twilio, Vonage, Telnyx, Bird, Brevo, Bandwidth, WhatsApp, Termii** and plain-text **MSG91** take one recipient per request. Rather than waiting for each one before starting the next, the package sends them concurrently using Laravel's `Http::pool()`.

Ten requests run at a time by default:

```ini [.env]
SMS_HTTP_CONCURRENCY=10
```

At around 300 ms per provider round trip, 100 recipients take roughly three seconds instead of thirty. Raise the number for big batches if your provider's rate limit allows it; lower it if you see `429 Too Many Requests`.

Amazon SNS publishes through the AWS SDK, one recipient at a time.

## Timeouts

```ini [.env]
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
```

The connect timeout fails fast when a provider is unreachable, which matters most in a [failover](/guide/failover) chain: the next provider gets its turn after 10 seconds instead of hanging.

## Token caching

Bandwidth and SendPulse use OAuth. Their access tokens are cached through your Laravel cache store until shortly before they expire, so most sends skip the extra round trip. If a provider rejects a token early, for example after you rotate credentials, it's dropped and the next send fetches a fresh one.

## In your application

- **Queue sends made during web requests.** [Queueing](/guide/queueing) moves the network wait out of the request entirely.
- **Use a bulk provider for large batches.** One request scales much better than hundreds.
- **Keep one message per batch.** Sending one message to 500 numbers is far faster than 500 separate sends of the same text.
