# Features

<p class="lead">Everything the package does, on one page. Each item links to the part of the guide that explains it.</p>

## Sending

| | |
|---|---|
| **One API, twenty providers** | Twilio, Vonage, Sinch, Bird, Plivo, Telnyx, Infobip, ClickSend, Clickatell, Brevo, Bandwidth, SendPulse, Amazon SNS, WhatsApp, MSG91, Sparrow SMS, Termii, Sendchamp, Africa's Talking and BulkSMS. [Providers →](/providers/) |
| **Fluent builder** | `Sms::to()->message()->send()`, with a fresh message for every call. [Composing messages →](/guide/sending) |
| **Number clean-up** | Spaces, dashes, dots and brackets removed, duplicates dropped, invalid numbers rejected before sending. [Recipients →](/guide/sending#recipients) |
| **Sender override** | `->from('ACME')` per message. [Sender →](/guide/sending#sender) |
| **Templates** | MSG91 Flows (DLT), WhatsApp templates and Brevo templates, with a text fallback for other providers. [Templates →](/guide/templates) |
| **Macros** | Name your recurring messages: `Sms::sendOtp($phone, $code)`. [Macros →](/guide/sending#macros) |

## Reliability

| | |
|---|---|
| **Results with message IDs** | Every send returns the provider's IDs for each accepted recipient. [Results →](/guide/results) |
| **Precise failures** | `DeliveryException` lists the recipients that failed and the ones that got through. [Partial failures →](/guide/results#partial-failures) |
| **Failover** | Chain providers; only rejected recipients move on, so nobody is texted twice. [Failover →](/guide/failover) |
| **Load balancing** | Spread messages across a pool of providers. [Load balancing →](/guide/failover#load-balancing) |
| **Queueing** | `sendLater()`, `sendLaterAt()`, one encrypted job per recipient with retries. [Queueing →](/guide/queueing) |

## Speed

| | |
|---|---|
| **Bulk requests** | Providers with a bulk endpoint receive every recipient in one call. [Performance →](/guide/performance) |
| **Parallel requests** | The others run concurrently, ten at a time by default. [Performance →](/guide/performance#per-recipient-providers-in-parallel) |
| **Token caching** | OAuth tokens are reused until they expire. [Token caching →](/guide/performance#token-caching) |

## Laravel integration

| | |
|---|---|
| **Notification channel** | `via()` returns `'sms'`, and `toSms()` returns the message. [Notifications →](/guide/notifications) |
| **Events** | `SmsSending` (cancellable), `SmsSent`, `SmsFailed` and `SmsWebhookReceived`, discovered automatically by your listeners. [Events →](/guide/events) |
| **Webhooks** | Signed delivery reports for WhatsApp, Termii, Sendchamp, Africa's Talking and BulkSMS. [Webhooks →](/guide/webhooks) |
| **Artisan** | `php artisan sms:test` and a section in `php artisan about`. [Artisan →](/reference/artisan) |
| **Octane and queue safe** | No state shared between sends or requests. |

## Testing

| | |
|---|---|
| **`Sms::fake()`** | Records messages instead of sending, with readable assertions. [Testing →](/guide/testing) |
| **`Http::fake()`** | Every HTTP driver runs on Laravel's HTTP client. [Testing a driver →](/guide/testing#testing-a-driver) |

## Security

| | |
|---|---|
| **Fail-closed webhooks** | Unsigned or unverifiable requests are rejected. [Webhooks →](/guide/webhooks) |
| **Encrypted queue payloads** | Codes and numbers are encrypted with your `APP_KEY`. [Queueing →](/guide/queueing#encrypted-at-rest) |
| **Credential hygiene** | No secrets in exception messages, URLs or cache keys; numbers masked in logs. [Security →](/guide/security) |

## Extending

| | |
|---|---|
| **Custom drivers** | Extend `HttpDriver` and describe only the provider's API. [Custom drivers →](/guide/custom-drivers) |
| **Runtime registration** | `Sms::extend('acme', …)` from a service provider. [Registering at runtime →](/guide/custom-drivers#registering-at-runtime) |
