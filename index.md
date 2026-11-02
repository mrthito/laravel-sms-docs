---
layout: home

hero:
  name: Laravel SMS
  text: Text messages, the Laravel way.
  tagline: Send through Twilio today and Sinch tomorrow without touching your code. Twenty providers, one fluent API, and results you can act on.
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction
    - theme: alt
      text: Browse providers
      link: /providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: Swap providers in .env
    details: Your code talks to one API. Change SMS_PROVIDER and the next message goes out through a different network.
  - title: Know what happened
    details: Every send returns the provider's message IDs. When something fails, you learn exactly which numbers were rejected and which got through.
  - title: Failover that doesn't double-text
    details: If Twilio accepts 98 of 100 recipients, only the other two move on to Vonage. Nobody hears from you twice.
  - title: Quick on large batches
    details: Bulk-capable providers get a single request. The rest send in parallel, ten at a time by default.
  - title: Secure by default
    details: Webhooks reject anything unsigned. Queued messages are encrypted. Credentials stay out of exception messages and cache keys.
  - title: A pleasure to test
    details: Sms::fake() records instead of sending, with assertions that read like sentences. Every driver works with Http::fake().
---

<div class="home-section">

## Write it once

<p>The API stays small: who it's for, what it says, and where you want the provider's answer.</p>

<div class="home-code">
<div>
<div class="caption">Send now</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">Or queue it</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">From a notification</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">In your tests</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## Twenty providers, ready to go

<p>The global platforms, the regional networks that reach places they don't, and a few drivers for development and testing.</p>

<div class="provider-cloud">
  <a href="/providers/twilio">Twilio</a>
  <a href="/providers/vonage">Vonage</a>
  <a href="/providers/sinch">Sinch</a>
  <a href="/providers/bird">Bird</a>
  <a href="/providers/plivo">Plivo</a>
  <a href="/providers/telnyx">Telnyx</a>
  <a href="/providers/infobip">Infobip</a>
  <a href="/providers/clicksend">ClickSend</a>
  <a href="/providers/clickatell">Clickatell</a>
  <a href="/providers/brevo">Brevo</a>
  <a href="/providers/bandwidth">Bandwidth</a>
  <a href="/providers/sendpulse">SendPulse</a>
  <a href="/providers/aws-sns">Amazon SNS</a>
  <a href="/providers/whatsapp">WhatsApp</a>
  <a href="/providers/msg91">MSG91</a>
  <a href="/providers/sparrow">Sparrow SMS</a>
  <a href="/providers/termii">Termii</a>
  <a href="/providers/sendchamp">Sendchamp</a>
  <a href="/providers/africastalking">Africa's Talking</a>
  <a href="/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## Up and running in two minutes

<p>Install the package, add your credentials, and send a real message from the terminal before you write a line of code.</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
