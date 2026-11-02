# API

<p class="lead">매일 쓰게 될 공개 클래스와 메서드를 한 페이지에 모았습니다.</p>

## Sms 파사드 {#sms-facade}

`MrRijal\LaravelSms\Facades\Sms`는 `SmsManager`로 호출을 위임합니다.

| 메서드 | 반환값 | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | 이 번호들에게 보낼 메시지 시작 |
| `provider(string $name)` | `PendingSms` | 특정 제공업체로 보낼 메시지 시작 |
| `message(string $text)` | `PendingSms` | 이 본문으로 메시지 시작 |
| `template(string $id, array $vars = [])` | `PendingSms` | 템플릿 메시지 시작 |
| `compose(?SmsMessage $message = null)` | `PendingSms` | 기존 메시지를 빌더로 감싸기 |
| `send(SmsMessage $message)` | `?SmsResult` | 발송. `sms.queue`가 켜져 있으면 큐에 넣음 |
| `sendNow(SmsMessage $message)` | `?SmsResult` | 즉시 발송 |
| `queue(SmsMessage $message, $delay = null)` | `void` | 수신자마다 작업 하나씩 큐에 넣기 |
| `driver(?string $name = null)` | `SmsProvider` | 제공업체의 드라이버 인스턴스 |
| `extend(string $name, Closure $factory)` | `SmsManager` | 직접 만든 드라이버 등록 |
| `getDefaultDriver()` | `string` | 기본 제공업체 키 |
| `forgetDrivers()` | `SmsManager` | 캐시된 드라이버 인스턴스 비우기 |
| `macro(string $name, callable $macro)` | `void` | 나만의 메서드 추가 |
| `fake()` | `SmsFake` | 매니저를 기록용 가짜 객체로 교체 |

## PendingSms {#pendingsms}

파사드가 반환하는 빌더입니다. 네 가지 동사를 제외한 모든 메서드는 빌더 자신을 반환합니다.

| 메서드 | |
|---|---|
| `to(string\|iterable $numbers)` | 수신자 추가 |
| `message(string $text)` / `content(string $text)` | 본문 지정 |
| `template(string $id, array $vars = [])` | 제공업체 템플릿 사용 |
| `from(?string $sender)` | 발신자 변경 |
| `provider(string $name)` | 제공업체 선택 |
| `when($condition, $callback)` / `unless(…)` | 조건에 따라 변경 적용 |
| `getMessage()` | 내부의 `SmsMessage` |
| `send()` → `?SmsResult` | 발송. `sms.queue`가 켜져 있으면 큐에 넣음 |
| `sendNow()` → `?SmsResult` | 즉시 발송 |
| `sendLater()` | 큐에 넣기 |
| `sendLaterAt($when)` / `later($when)` | 지연 시간을 두고 큐에 넣기. 날짜, 시간 간격, 초 단위 숫자 |

## SmsMessage {#smsmessage}

`MrRijal\LaravelSms\SmsMessage`는 메시지 하나를 담습니다. setter는 메시지 자신을 반환하므로 체이닝할 수 있습니다.

| 메서드 | |
|---|---|
| `SmsMessage::create(?string $text = null)` | 새 메시지. 본문은 선택 사항 |
| `to()`, `message()`, `content()`, `template()`, `from()`, `provider()` | `PendingSms`와 동일 |
| `getTo()` → `list<string>` | 정규화된 수신자 |
| `getText()`, `getTemplateId()`, `getFrom()`, `getProvider()` → `?string` | |
| `getVariables()` → `array` | 템플릿 변수 |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | 다른 번호로 보내는 복사본 |
| `getRedactedRecipientsForLogging()` → `list<string>` | `***4567`처럼 가린 번호 |
| `validate()` | 보낼 수 없는 메시지면 `InvalidMessageException`을 던짐 |

## SmsResult {#smsresult}

| 멤버 | |
|---|---|
| `$provider` | 메시지를 보낸 제공업체 키 |
| `$messages` | `list<SentMessage>`. 접수된 수신자마다 하나씩 |
| `recipients()` → `list<string>` | 접수된 번호 |
| `ids()` → `list<string>` | 중복을 제거한 제공업체 메시지 ID |
| `firstId()` → `?string` | 첫 번째 메시지 ID |
| `count()` | 접수된 수신자 수 |

`SentMessage`에는 읽기 전용 속성 `$to`, `$id`, `$status` 세 개가 있습니다.

## 예외 {#exceptions}

모두 `MrRijal\LaravelSms\Exceptions`에 있으며, 모두 `SmsException`을 구현합니다.

| 클래스 | 멤버 / 발생 상황 |
|---|---|
| `DeliveryException` | `$provider`, `$failedRecipients`, `$partial` (`?SmsResult`), `hasPartialDelivery()`, `getCode()` (HTTP 상태 코드) |
| `InvalidMessageException` | 잘못된 번호 형식, 비었거나 너무 긴 본문, 지원하지 않는 메시지 유형 |
| `InvalidConfigurationException` | 알 수 없는 제공업체, 없거나 잘못된 설정 |

## 계약(Contracts) {#contracts}

| 인터페이스 | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult`. 드라이버를 만들 때 구현합니다 |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response`. 제공업체 웹훅을 받습니다 |
| `Contracts\Factory` | 매니저에 바인딩되어 있습니다. 의존성 주입 시 타입 힌트로 쓰세요 |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
