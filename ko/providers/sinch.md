# Sinch

<p class="lead">여러 국가의 통신사와 직접 연결된 통신사급 플랫폼입니다. 모든 수신자를 배치 요청 하나로 보냅니다.</p>

| | |
|---|---|
| 드라이버 키 | `sinch` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [sinch.com](https://sinch.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| 변수 | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | SMS 대시보드의 Service plan ID |
| `SINCH_API_TOKEN` | 해당 service plan의 API 토큰 |
| `SINCH_FROM` | 발신 번호 또는 영숫자 ID |
| `SINCH_REGION` | `us`(기본값), `eu`, `au`, `br`, `ca` 중 하나. 계정이 있는 리전과 일치해야 합니다 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- service plan을 만든 리전을 쓰세요. 리전이 다르면 토큰이 유효해도 `401`이 반환됩니다.
- 배치 전체가 Sinch 배치 ID 하나를 공유하며, `$result->firstId()`로 받을 수 있습니다.
