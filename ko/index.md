---
layout: home

hero:
  name: Laravel SMS
  text: 문자 발송도 Laravel답게.
  tagline: 오늘은 Twilio로, 내일은 Sinch로. 코드는 그대로 두고 문자 서비스만 바꾸세요. 제공업체 스무 곳, 하나의 플루언트 API, 그리고 바로 활용할 수 있는 발송 결과까지.
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/guide/introduction
    - theme: alt
      text: 제공업체 둘러보기
      link: /ko/providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: .env에서 제공업체 교체
    details: 코드는 하나의 API만 바라봅니다. SMS_PROVIDER 값만 바꾸면 다음 메시지부터 다른 네트워크로 나갑니다.
  - title: 무슨 일이 있었는지 정확히
    details: 발송할 때마다 제공업체의 메시지 ID를 돌려받습니다. 실패하면 어떤 번호가 거부되고 어떤 번호가 성공했는지 정확히 알 수 있습니다.
  - title: 중복 발송 없는 페일오버
    details: Twilio가 수신자 100명 중 98명을 받아들였다면, 나머지 두 명만 Vonage로 넘어갑니다. 같은 문자를 두 번 받는 사람은 없습니다.
  - title: 대량 발송도 빠르게
    details: 대량 발송을 지원하는 제공업체에는 요청을 한 번만 보냅니다. 나머지는 기본값으로 열 건씩 병렬로 보냅니다.
  - title: 기본부터 안전하게
    details: 서명 없는 웹훅은 모두 거부합니다. 큐에 들어간 메시지는 암호화됩니다. 인증 정보는 예외 메시지나 캐시 키에 남지 않습니다.
  - title: 테스트가 즐거워집니다
    details: Sms::fake()는 실제로 보내지 않고 기록만 하며, 어서션은 문장처럼 읽힙니다. 모든 드라이버가 Http::fake()와 함께 동작합니다.
---

<div class="home-section">

## 한 번만 작성하세요 {#write-it-once}

<p>API는 작게 유지됩니다. 누구에게, 무슨 내용을, 그리고 제공업체의 응답을 어디서 받을지만 정하면 됩니다.</p>

<div class="home-code">
<div>
<div class="caption">바로 보내기</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">또는 큐로 보내기</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">알림에서 보내기</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">테스트에서</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## 바로 쓸 수 있는 제공업체 스무 곳 {#twenty-providers-ready-to-go}

<p>글로벌 플랫폼은 물론, 그들이 닿지 못하는 지역까지 커버하는 지역 네트워크, 그리고 개발과 테스트용 드라이버 몇 가지를 준비했습니다.</p>

<div class="provider-cloud">
  <a href="/ko/providers/twilio">Twilio</a>
  <a href="/ko/providers/vonage">Vonage</a>
  <a href="/ko/providers/sinch">Sinch</a>
  <a href="/ko/providers/bird">Bird</a>
  <a href="/ko/providers/plivo">Plivo</a>
  <a href="/ko/providers/telnyx">Telnyx</a>
  <a href="/ko/providers/infobip">Infobip</a>
  <a href="/ko/providers/clicksend">ClickSend</a>
  <a href="/ko/providers/clickatell">Clickatell</a>
  <a href="/ko/providers/brevo">Brevo</a>
  <a href="/ko/providers/bandwidth">Bandwidth</a>
  <a href="/ko/providers/sendpulse">SendPulse</a>
  <a href="/ko/providers/aws-sns">Amazon SNS</a>
  <a href="/ko/providers/whatsapp">WhatsApp</a>
  <a href="/ko/providers/msg91">MSG91</a>
  <a href="/ko/providers/sparrow">Sparrow SMS</a>
  <a href="/ko/providers/termii">Termii</a>
  <a href="/ko/providers/sendchamp">Sendchamp</a>
  <a href="/ko/providers/africastalking">Africa's Talking</a>
  <a href="/ko/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## 2분이면 시작할 수 있습니다 {#up-and-running-in-two-minutes}

<p>패키지를 설치하고 인증 정보를 넣은 뒤, 코드 한 줄 쓰기 전에 터미널에서 실제 문자를 보내 보세요.</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
