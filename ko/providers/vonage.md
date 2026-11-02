# Vonage

<p class="lead">예전 이름은 Nexmo입니다. 해외 커버리지가 탄탄하고 요금 체계가 단순하며, Vonage SMS API를 사용합니다.</p>

| | |
|---|---|
| 드라이버 키 | `vonage` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.vonage.com](https://www.vonage.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| 변수 | |
|---|---|
| `VONAGE_KEY` | API key |
| `VONAGE_SECRET` | API secret |
| `VONAGE_FROM` | 발신 번호 또는 영숫자 ID |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 이모지나 데바나가리 문자처럼 GSM 문자 집합에 없는 문자가 들어간 메시지는 자동으로 유니코드로 보내므로, 깨지지 않고 도착합니다.
- Vonage는 메시지를 거부할 때도 HTTP 200으로 응답합니다. 드라이버가 메시지별 상태를 읽기 때문에, 거부된 경우에는 Vonage가 밝힌 사유와 함께 `DeliveryException`이 발생합니다.
