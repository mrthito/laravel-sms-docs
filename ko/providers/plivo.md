# Plivo

<p class="lead">단순한 REST API를 갖춘, 비용 효율적인 글로벌 제공업체입니다. 모든 수신자를 요청 하나로 보냅니다.</p>

| | |
|---|---|
| 드라이버 키 | `plivo` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.plivo.com](https://www.plivo.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| 변수 | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth token |
| `PLIVO_FROM` | 발신 번호 또는 영숫자 ID |
| `PLIVO_LOG_MESSAGES` | 선택 사항, 기본값 `false`. Plivo가 메시지 내용과 번호를 자체 로그에 저장할지 여부 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 이 패키지에서는 Plivo 자체의 내용 로깅이 기본적으로 **꺼져** 있어, 메시지 본문이 Plivo 대시보드에 남지 않습니다. 디버깅에 필요할 때만 켜세요.
- 수신자마다 Plivo 메시지 UUID가 하나씩 부여되며, 순서는 수신자를 넘긴 순서와 같습니다.
