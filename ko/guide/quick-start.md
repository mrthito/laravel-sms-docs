# 첫 문자 보내기

<p class="lead">가장 자주 하게 될 다섯 가지, 즉 발송, 결과 확인, 큐, 알림, 테스트를 차례로 둘러봅니다.</p>

## 메시지 보내기 {#send-a-message}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

번호에는 공백, 하이픈, 점, 괄호가 들어가도 됩니다. `+1 (555) 123-4567`과 `+15551234567`은 같은 수신자로 취급합니다. 가능하면 앞에 `+`를 붙인 국제 형식을 쓰세요. 대부분의 제공업체는 이 형식이어야 메시지를 제대로 라우팅합니다.

## 결과 확인 {#check-what-happened}

`sendNow()`는 즉시 발송하고 `SmsResult`를 반환합니다.

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // 제공업체의 메시지 ID. 저장해 두면 좋습니다
```

제공업체가 메시지를 거부하면 `DeliveryException`이 그 이유를 알려 줍니다.

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

일부만 실패한 경우와 각 속성에 무엇이 담기는지는 [발송 결과와 오류](/ko/guide/results)에서 다룹니다.

## 큐로 보내기 {#queue-it}

발송에는 네트워크 왕복 시간이 걸립니다. 웹 요청 안에서 보낼 때는 메시지를 큐에 넣어 사용자가 기다리지 않게 하세요.

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## 알림으로 보내기 {#send-it-as-a-notification}

이미 Laravel 알림을 쓰고 있다면 `sms` 채널을 추가하세요.

```php
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.");
    }
}
```

채널은 모델의 `routeNotificationForSms()`를 호출해 번호를 가져옵니다. 자세한 내용은 [알림](/ko/guide/notifications)을 참고하세요.

## 테스트하기 {#test-it}

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

여기까지가 패키지의 핵심입니다. 나머지 가이드에서는 [메시지 작성](/ko/guide/sending)부터 시작해 각 부분을 더 깊이 살펴봅니다.
