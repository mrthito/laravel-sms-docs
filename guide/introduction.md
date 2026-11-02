# Introduction

<p class="lead">Laravel SMS gives your application one way to send text messages, whichever provider is on the other end. You write <code>Sms::to($number)->message($text)->send()</code>, and the package takes care of the provider's API, its quirks and its failures.</p>

## Why it exists

Most applications start with one provider and a small wrapper around its SDK. That wrapper grows. Then pricing changes, a country needs a local gateway, or delivery to one network gets unreliable, and the wrapper has to grow a second provider. Every app ends up writing the same plumbing: retries, sender IDs, phone number cleanup, logging and tests.

This package is that plumbing, written once and tested on every supported PHP and Laravel version.

## What you get

- **One API for twenty providers.** Twilio, Vonage, Sinch, Bird, Plivo, Telnyx, Infobip, ClickSend, Clickatell, Brevo, Bandwidth, SendPulse, Amazon SNS and WhatsApp, plus regional gateways for India, Nepal and Africa.
- **Answers, not booleans.** A send returns the provider's message IDs. A failure tells you which numbers were rejected and which went through.
- **Failover without duplicates.** Chain providers, and only the recipients a provider rejected move on to the next one.
- **Laravel all the way down.** A notification channel, queued jobs, events, macros, `php artisan sms:test`, and `Sms::fake()` for your tests.

## How a message travels

```text
Sms::to(…)->message(…)         your code
        │
   PendingSms                  a fresh message for every send
        │
   SmsManager                  picks the provider, fires SmsSending
        │
   Driver                      talks to Twilio, Sinch, …
        │
   SmsResult                   message IDs, fires SmsSent
```

Each call to the facade starts a brand-new message, so nothing leaks between sends, even under Octane or in a long-running queue worker. The manager chooses the provider: the one you asked for, your default, or the next one in a failover chain. The driver turns your message into the provider's HTTP request and its response back into an `SmsResult`.

## Requirements

| Laravel | PHP |
|---|---|
| 13.x | 8.3, 8.4, 8.5 |
| 12.x | 8.2, 8.3, 8.4, 8.5 |
| 11.x | 8.2, 8.3, 8.4, 8.5 |

::: warning Laravel 11
Laravel 11 no longer receives security fixes. The package still supports it so existing applications can upgrade at their own pace, but new projects should start on Laravel 12 or 13.
:::

## Next steps

Install the package and send your first message: it takes about two minutes.

<div style="margin-top: 20px">

[Installation →](/guide/installation)

</div>
