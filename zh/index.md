---
layout: home

hero:
  name: Laravel SMS
  text: 用 Laravel 的方式发短信
  tagline: 今天走 Twilio，明天换 Sinch，业务代码一行不用改。二十家服务商，一套流畅的 API，每次发送都有可用的结果。
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: 开始使用
      link: /zh/guide/introduction
    - theme: alt
      text: 浏览服务商
      link: /zh/providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: 在 .env 里切换服务商
    details: 代码只面对一套 API。改一下 SMS_PROVIDER，下一条短信就走另一家网络发出。
  - title: 发送结果一清二楚
    details: 每次发送都会返回服务商的消息 ID。出了问题，你能准确知道哪些号码被拒、哪些已经发出。
  - title: 故障转移不重发
    details: Twilio 接收了 100 个收件人中的 98 个，只有剩下的 2 个会转给 Vonage。没有人会收到两遍。
  - title: 大批量发送也快
    details: 支持批量的服务商只发一次请求，其余的并行发送，默认每次 10 个。
  - title: 默认就安全
    details: 未签名的 Webhook 一律拒绝，队列中的短信全程加密，凭据不会出现在异常信息和缓存键里。
  - title: 测试写起来很顺手
    details: Sms::fake() 只记录不发送，断言读起来就像一句话。所有驱动都能配合 Http::fake() 使用。
---

<div class="home-section">

## 写一次就够了

<p>API 很精简：发给谁、说什么、服务商的返回结果要放到哪里。</p>

<div class="home-code">
<div>
<div class="caption">立即发送</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">或者放进队列</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">通过通知发送</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">在测试中</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## 二十家服务商，开箱即用

<p>既有覆盖全球的平台，也有能触达大平台覆盖不到之处的区域网络，另外还有几个用于开发和测试的驱动。</p>

<div class="provider-cloud">
  <a href="/zh/providers/twilio">Twilio</a>
  <a href="/zh/providers/vonage">Vonage</a>
  <a href="/zh/providers/sinch">Sinch</a>
  <a href="/zh/providers/bird">Bird</a>
  <a href="/zh/providers/plivo">Plivo</a>
  <a href="/zh/providers/telnyx">Telnyx</a>
  <a href="/zh/providers/infobip">Infobip</a>
  <a href="/zh/providers/clicksend">ClickSend</a>
  <a href="/zh/providers/clickatell">Clickatell</a>
  <a href="/zh/providers/brevo">Brevo</a>
  <a href="/zh/providers/bandwidth">Bandwidth</a>
  <a href="/zh/providers/sendpulse">SendPulse</a>
  <a href="/zh/providers/aws-sns">Amazon SNS</a>
  <a href="/zh/providers/whatsapp">WhatsApp</a>
  <a href="/zh/providers/msg91">MSG91</a>
  <a href="/zh/providers/sparrow">Sparrow SMS</a>
  <a href="/zh/providers/termii">Termii</a>
  <a href="/zh/providers/sendchamp">Sendchamp</a>
  <a href="/zh/providers/africastalking">Africa's Talking</a>
  <a href="/zh/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## 两分钟跑起来

<p>安装扩展包，填好凭据，还没写一行代码，就能在终端里发出一条真实的短信。</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
