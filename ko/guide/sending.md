# 메시지 작성

<p class="lead">모든 발송은 <code>Sms</code> 파사드에서 시작해 네 가지 동사 중 하나로 끝납니다. 그 사이에서 메시지의 내용을 채웁니다.</p>

## 빌더 {#the-builder}

`Sms::to()`, `Sms::provider()`, `Sms::message()`, `Sms::template()` 중 무엇을 호출하든 새 `PendingSms`가 반환됩니다. 필요한 메서드를 체이닝한 뒤 동사로 마무리하세요.

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // 선택 사항: 기본값은 SMS_PROVIDER
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // 선택 사항: 설정된 발신자를 덮어씁니다
    ->message('Doors open at 7pm.')
    ->send();
```

| 동사 | 동작 | 반환값 |
|---|---|---|
| `send()` | 즉시 발송. `SMS_QUEUE=true`이면 큐에 넣음 | `SmsResult`, 큐에 넣었으면 `null` |
| `sendNow()` | 항상 즉시 발송 | `SmsResult` (리스너가 취소하면 `null`) |
| `sendLater()` | 항상 큐에 넣음 | 없음 |
| `sendLaterAt($when)` | 지연 시간을 두고 큐에 넣음 (`later()`는 별칭) | 없음 |

파사드를 호출할 때마다 새 빌더가 만들어지므로, 오래 실행되는 Octane 워커 안에서도 두 발송이 수신자나 본문을 공유하는 일은 없습니다.

## 수신자 {#recipients}

`to()`에는 번호 하나, 배열, 또는 컬렉션을 포함한 어떤 iterable이든 넘길 수 있습니다.

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

번호는 추가하는 순간 정리되고 검사됩니다.

- 공백, 하이픈, 점, 괄호는 제거됩니다.
- 남은 값은 7~15자리 숫자여야 하며, 앞에 `+`가 붙어도 됩니다. 그 밖의 값은 나중에 제공업체에서 실패하는 대신 그 자리에서 바로 `InvalidMessageException`을 던집니다.
- 중복된 번호는 제거되므로, 한 번의 발송에서 같은 사람에게 문자가 두 번 가지 않습니다.

::: tip E.164 형식을 쓰세요
번호는 `+` 뒤에 국가 번호와 전화번호를 붙인 국제 형식으로 저장하고 보내세요. 어떤 제공업체는 국내 형식을 아예 거부하고, 어떤 제공업체는 엉뚱한 국가로 라우팅합니다.
:::

## 본문 {#text}

```php
Sms::to($phone)->message('Your table is ready.');
```

본문은 앞뒤 공백이 제거되며 비어 있으면 안 됩니다. 최대 1,600자까지 보낼 수 있습니다. 제공업체는 SMS 한 건 분량(GSM 문자 160자, 이모지 등 유니코드가 포함되면 70자)을 넘는 메시지를 여러 건으로 나눠 보내고 건마다 요금을 매기므로, 짧을수록 저렴합니다.

`content()`는 `message()`의 별칭입니다. Laravel 알림에서 쓰는 표현이 더 익숙하다면 이쪽을 쓰세요.

## 템플릿 {#templates}

일부 제공업체는 자유 형식의 본문 대신 사전 승인된 템플릿을 보냅니다. 인도에서는 DLT 규제 때문에 템플릿이 필수이고, WhatsApp은 비즈니스가 먼저 시작하는 대화에 템플릿을 요구합니다.

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

템플릿은 [MSG91](/ko/providers/msg91), [WhatsApp](/ko/providers/whatsapp), [Brevo](/ko/providers/brevo)에서 지원합니다. 다른 제공업체는 본문이 있어야 하며, 템플릿만 있는 메시지를 보내면 해당 제공업체 이름이 담긴 `InvalidMessageException`이 발생합니다.

## 발신자 {#sender}

제공업체마다 번호나 `ACME` 같은 영숫자 ID 형태의 발신자가 설정되어 있습니다. 특정 메시지에서만 바꾸려면 `from()`을 쓰세요.

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

영숫자 발신자는 모든 곳에서 허용되지는 않습니다. 미국과 캐나다에서는 등록된 번호로만 보낼 수 있으니, 문자를 보내는 국가마다 제공업체의 규정을 확인하세요.

## 제공업체 지정 {#choosing-a-provider}

`provider()`를 쓰면 기본 제공업체 대신 특정 제공업체로 이 메시지를 보냅니다.

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

특별한 이름이 두 가지 있습니다. `failover`는 여러 제공업체를 순서대로 시도하고, `random`은 풀에서 하나를 고릅니다. 둘 다 [페일오버와 부하 분산](/ko/guide/failover)에서 다룹니다.

## 조건부 구성 {#conditional-parts}

`PendingSms`는 Laravel의 `when()`과 `unless()`를 지원합니다.

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## 메시지 미리 만들어 두기 {#building-a-message-ahead-of-time}

`SmsMessage`는 평범한 객체라서 미리 만들어 두고, 여기저기 넘겼다가, 나중에 보낼 수 있습니다.

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## 매크로 {#macros}

자주 보내는 메시지에는 이름을 붙여 두세요.

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Sms::macro('sendOtp', function (string $phone, int $code) {
        return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
    });
}

// 앱 어디서든
Sms::sendOtp($user->phone, 4821);
```
