# SendPulse

<p class="lead">유럽과 중남미에서 인기 있는 멀티채널 마케팅 플랫폼입니다. OAuth 2.0으로 인증하며, 모든 수신자를 요청 하나로 보냅니다.</p>

| | |
|---|---|
| 드라이버 키 | `sendpulse` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [sendpulse.com](https://sendpulse.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| 변수 | |
|---|---|
| `SENDPULSE_CLIENT_ID` | REST API ID |
| `SENDPULSE_CLIENT_SECRET` | REST API secret |
| `SENDPULSE_SENDER` | 승인된 발신자 이름 (최대 11자) |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 액세스 토큰은 약 한 시간 동안 캐시되며 자동으로 갱신됩니다.
- 발신자 이름은 SendPulse 대시보드에서 승인을 받아야 쓸 수 있습니다.
