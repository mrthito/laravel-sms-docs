# Twilio

<p class="lead">가장 널리 쓰이는 SMS API입니다. 북미와 유럽에서 전달률이 뛰어나며, 발신 번호 풀과 규정 준수를 위한 Messaging Service를 제공합니다.</p>

| | |
|---|---|
| 드라이버 키 | `twilio` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.twilio.com](https://www.twilio.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| 변수 | |
|---|---|
| `TWILIO_SID` | Account SID. `AC`로 시작합니다 |
| `TWILIO_TOKEN` | Auth token |
| `TWILIO_FROM` | 발신 번호 또는 영숫자 ID |
| `TWILIO_MESSAGING_SERVICE_SID` | 선택 사항. 발신자 하나 대신 Messaging Service를 사용합니다 (`MG`로 시작) |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- `TWILIO_FROM`과 `TWILIO_MESSAGING_SERVICE_SID` 중 하나는 반드시 있어야 합니다. Messaging Service를 쓰면 Twilio가 번호 풀에서 가장 적합한 번호를 골라 주고, 수신 거부 처리도 대신 해 줍니다.
- 메시지에 `from()`을 지정하면 그 발신자를 쓰고, 해당 메시지에는 Messaging Service를 쓰지 않습니다.
- 체험(trial) 계정은 Twilio 콘솔에서 인증한 번호로만 문자를 보낼 수 있습니다.
