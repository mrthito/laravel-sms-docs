# Bird

<p class="lead">예전에 MessageBird라는 이름으로 알려졌던 회사입니다. 이 드라이버는 워크스페이스 API 키로 Bird의 현행 SMS API를 사용합니다.</p>

| | |
|---|---|
| 드라이버 키 | `bird` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [bird.com](https://bird.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| 변수 | |
|---|---|
| `BIRD_API_KEY` | 워크스페이스 API 키. `bk_`로 시작합니다 |
| `BIRD_FROM` | 발신 번호 또는 영숫자 ID |
| `BIRD_REGION` | `us1`(기본값) 또는 `eu1`. 키와 일치해야 합니다 |
| `BIRD_CATEGORY` | `transactional`(기본값), `marketing`, `authentication`, `service` 중 하나 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=bird
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 키는 리전에 묶여 있습니다. `bk_eu1_…` 키는 `BIRD_REGION=eu1`에서만 동작합니다.
- `BIRD_CATEGORY`는 실제 용도에 맞게 설정하세요. 여러 국가에서 마케팅 문자에는 다른 규정과 다른 요금을 적용합니다.
- 예전 MessageBird의 `AccessKey` 인증 정보는 지원하지 않습니다. Bird 대시보드에서 워크스페이스 키를 새로 만드세요.
