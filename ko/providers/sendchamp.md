# Sendchamp

<p class="lead">DND, non-DND, 국제 경로를 갖춘 나이지리아의 커뮤니케이션 플랫폼입니다. 모든 수신자를 요청 하나로 보냅니다.</p>

| | |
|---|---|
| 드라이버 키 | `sendchamp` |
| 지원 지역 | 나이지리아 및 아프리카 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 |
| 웹사이트 | [sendchamp.com](https://sendchamp.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| 변수 | |
|---|---|
| `SENDCHAMP_API_KEY` | Public access key |
| `SENDCHAMP_SENDER_NAME` | 승인된 발신자 이름 |
| `SENDCHAMP_ROUTE` | `dnd`(기본값), `non_dnd`, `international` 중 하나 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 로그인 코드처럼 시간이 중요한 메시지는 `dnd` 경로로 보내세요. DND(수신 거부)에 등록한 번호에도 도달합니다.

## 전송 보고서 {#delivery-reports}

Sendchamp의 전송 보고서 URL을 `https://your-app.com/laravel-sms/webhook/sendchamp`로 지정하고 [웹훅](/ko/guide/webhooks)을 켜세요. 요청은 `SENDCHAMP_WEBHOOK_SECRET`을 사용해 `X-Sendchamp-Signature`의 HMAC-SHA256으로 검증합니다.

검증된 보고서는 `SmsWebhookReceived` 이벤트를 발생시킵니다.
