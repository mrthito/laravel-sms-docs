# 발송 결과와 오류

<p class="lead">문자는 도착해야 의미가 있습니다. 발송할 때마다 제공업체가 무엇을 받아들였는지 알려 주고, 문제가 생기면 어떤 수신자가 영향을 받았는지 정확히 알려 줍니다.</p>

## 발송 결과 {#the-result}

`sendNow()`는 `SmsResult`를 반환합니다.

```php
$result = Sms::to(['+15551234567', '+15557654321'])
    ->message('Hi')
    ->sendNow();

$result->provider;      // "twilio"
$result->recipients();  // ["+15551234567", "+15557654321"]
$result->ids();         // ["SM1a…", "SM2b…"]
$result->firstId();     // "SM1a…"
count($result);         // 2

foreach ($result->messages as $sent) {
    $sent->to;      // "+15551234567"
    $sent->id;      // "SM1a…"
    $sent->status;  // "queued". 제공업체가 보고한 값 그대로입니다
}
```

메시지 ID는 저장해 두세요. 제공업체의 전송 보고서를 조회할 때, 고객 지원 문의("SM1a… 메시지는 어디 갔나요?")에 답할 때, 그리고 [웹훅](/ko/guide/webhooks)을 어떤 메시지에서 발생했는지 연결할 때 기준이 됩니다.

::: info 접수됐을 뿐, 도착한 것은 아닙니다
결과가 돌아왔다는 것은 제공업체가 메시지를 **접수**했다는 뜻입니다. 휴대폰까지 전달되는 것은 몇 초 뒤이며, 휴대폰이 꺼져 있거나 번호가 바뀌었다면 그때도 실패할 수 있습니다. 최종 도착 여부는 [웹훅](/ko/guide/webhooks)으로 추적하세요.
:::

`sendNow()`가 `null`을 반환하는 경우는 딱 하나, [`SmsSending` 리스너](/ko/guide/events#cancelling-a-send)가 발송을 취소했을 때뿐입니다. `send()`는 메시지를 바로 보내지 않고 큐에 넣었을 때도 `null`을 반환합니다.

## 제공업체가 거부할 때 {#when-a-provider-says-no}

발송이 거부되거나 제공업체에 연결할 수 없으면 `DeliveryException`이 발생합니다. 예외 메시지는 사람이 읽기 좋게 작성되며 로그에 남겨도 안전합니다.

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

제공업체가 보낸 설명은 200자까지 잘라서 포함합니다. 인증 정보는 절대 포함하지 않습니다.

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400. HTTP 상태 코드가 있으면 그 값
    $e->failedRecipients;       // 제공업체가 받아들이지 않은 번호
    $e->partial?->recipients(); // 실패하기 전에 받아들인 번호
}
```

## 일부만 실패한 경우 {#partial-failures}

백 명에게 보내다 보면 번호 하나쯤은 잘못되어 있을 수 있습니다. 이 패키지는 그렇다고 발송 전체가 실패한 척하지도, 실패한 하나를 감추지도 않습니다.

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 99명은 이미 메시지를 받았습니다. 이들에게 다시 보내지 마세요.
        $delivered = $e->partial->recipients();
    }

    // 이 번호들만 재시도하거나, 표시하거나, 보고하세요.
    $e->failedRecipients;
}
```

예외 메시지에도 몇 명이 실패했는지 나옵니다. `… (1 of 100 recipients failed)`처럼요.

[페일오버](/ko/guide/failover)가 안전한 이유도 여기에 있습니다. 다음 제공업체는 언제나 `failedRecipients`만 넘겨받습니다.

## 패키지가 던지는 모든 예외 {#every-exception-the-package-throws}

모든 예외가 `MrRijal\LaravelSms\Exceptions\SmsException`을 구현하므로 `catch` 하나로 패키지의 예외를 모두 잡을 수 있습니다.

| 예외 | 상위 클래스 | 발생 시점 |
|---|---|---|
| `DeliveryException` | `RuntimeException` | 제공업체가 메시지를 거부했거나, 연결할 수 없거나, 인증에 실패했을 때 |
| `InvalidMessageException` | `InvalidArgumentException` | 번호 형식이 잘못됐거나, 본문이 비었거나 너무 길거나, 제공업체가 이런 종류의 메시지를 보낼 수 없을 때 |
| `InvalidConfigurationException` | `InvalidArgumentException` | 알 수 없는 제공업체이거나, 인증 정보나 설정이 없거나 잘못됐을 때 |

잘못된 메시지와 설정은 **아무것도 보내기 전에** 실패하므로, 어설픈 실수에 요금을 낼 일이 없습니다.
