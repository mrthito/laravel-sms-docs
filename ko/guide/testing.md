# 테스트

<p class="lead">테스트가 실제 휴대폰으로 문자를 보내서는 안 됩니다. 파사드를 가짜로 바꾸고, 코드를 실행한 뒤, 무엇이 발송됐을지 어서션으로 확인하세요.</p>

## 발송 가짜로 바꾸기 {#faking-sends}

```php
use MrRijal\LaravelSms\Facades\Sms;
use MrRijal\LaravelSms\SmsMessage;

it('sends a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567'])->assertOk();

    Sms::assertSentTo('+15551234567');
    Sms::assertSent(fn (SmsMessage $sms) => str_contains($sms->getText(), 'code'));
    Sms::assertSentCount(1);
});

it('stays quiet for unverified numbers', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15550000000']);

    Sms::assertNothingSent();
});
```

`Sms::fake()`는 패키지가 문자를 보내는 모든 곳에서 동작합니다. 파사드, 알림, `HasSms` 트레이트, 큐 작업 모두 해당됩니다.

## 사용할 수 있는 어서션 {#available-assertions}

| 어서션 | 통과 조건 |
|---|---|
| `assertSent($callback)` | 발송된 메시지 중 하나 이상이 콜백과 일치 |
| `assertSent($count)` | 정확히 `$count`개의 메시지가 발송됨 |
| `assertSentTo($number, $callback = null)` | `$number`로 메시지가 발송됨 (번호 형식은 무관) |
| `assertNotSent($callback = null)` | 일치하는 발송 메시지가 없음 |
| `assertNothingSent()` | 아무것도 발송되지 않음 |
| `assertSentCount($count)` | 정확히 `$count`개의 메시지가 발송됨 |
| `assertQueued($callback or $count)` | 메시지가 큐에 들어갔거나, 정확히 `$count`개가 들어감 (수신자마다 하나) |
| `assertNothingQueued()` | 큐에 들어간 것이 없음 |

메시지를 직접 살펴보려면 `Sms::sent()`와 `Sms::queued()`를 쓰세요. 둘 다 `SmsMessage` 컬렉션을 반환합니다.

## 실제와 똑같이 동작합니다 {#it-behaves-like-the-real-thing}

가짜 객체는 제공업체를 호출하지 않을 뿐, 그 직전까지는 모든 과정을 그대로 거칩니다.

- 메시지를 검증하므로, 잘못된 번호는 테스트에서도 실패합니다.
- 제공업체 이름을 확인합니다. `Sms::provider('twillio')`는 프로덕션과 똑같이 예외를 던집니다.
- `SmsSending`과 `SmsSent`가 발생하므로, 발송을 취소하는 리스너를 포함해 리스너를 테스트할 수 있습니다.
- `Sms::extend()`로 등록한 드라이버도 계속 동작합니다.
- 각 메시지는 발송된 순간의 상태 그대로 기록됩니다. 이후에 코드가 메시지를 바꿔도 영향을 받지 않습니다.

## 드라이버 테스트하기 {#testing-a-driver}

[직접 만든 드라이버](/ko/guide/custom-drivers)를 포함해 제공업체 연동을 테스트하려면 HTTP 계층을 가짜로 바꾸세요. 모든 HTTP 드라이버는 Laravel의 HTTP 클라이언트를 쓰므로 `Http::fake()`가 요청을 가로챕니다.

```php
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

Http::fake([
    'api.twilio.com/*' => Http::response(['sid' => 'SM123', 'status' => 'queued'], 201),
]);

$result = Sms::provider('twilio')->to('+15551234567')->message('Hi')->sendNow();

expect($result->firstId())->toBe('SM123');

Http::assertSent(fn (Request $request) => $request['To'] === '+15551234567');
```

`Http::preventStrayRequests()`를 추가하면 실제 API로 새어 나가는 요청이 없는지 확실히 할 수 있습니다.

::: info Amazon SNS
SNS 드라이버는 Laravel의 HTTP 클라이언트가 아니라 AWS SDK를 쓰기 때문에 `Http::fake()`가 닿지 않습니다. 대신 목(mock) `SnsClient`를 드라이버에 넘기세요: `new AwsSnsDriver($config, $snsClient)`.
:::
