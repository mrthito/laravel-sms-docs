# Bandwidth

<p class="lead">자체 네트워크를 보유한 미국 통신사로, 여러 대형 커뮤니케이션 플랫폼이 사용합니다. OAuth 2.0으로 인증합니다.</p>

| | |
|---|---|
| 드라이버 키 | `bandwidth` |
| 지원 지역 | 미국, 캐나다 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.bandwidth.com](https://www.bandwidth.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| 변수 | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | Account ID |
| `BANDWIDTH_APPLICATION_ID` | 번호에 연결된 메시징 애플리케이션 |
| `BANDWIDTH_CLIENT_ID` | OAuth client ID |
| `BANDWIDTH_CLIENT_SECRET` | OAuth client secret |
| `BANDWIDTH_FROM` | 해당 애플리케이션에 할당된 Bandwidth 번호 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 드라이버는 client ID와 secret으로 액세스 토큰을 발급받아 약 한 시간 동안 캐시합니다. 토큰이 예정보다 일찍 거부되면 버리고, 다음 발송에서 새 토큰을 받아 옵니다.
- 수신자에게 하나씩 따로 보내는 것은 의도된 동작입니다. Bandwidth는 요청 하나에 번호가 여러 개 있으면 그룹 대화로 취급해, 모두가 서로의 답장을 보게 됩니다.
