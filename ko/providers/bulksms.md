# BulkSMS

<p class="lead">모든 수신자를 JSON 요청 하나로 보내는, 군더더기 없는 글로벌 게이트웨이입니다.</p>

| | |
|---|---|
| 드라이버 키 | `bulksms` |
| 지원 지역 | 전 세계, 남아프리카에서 특히 강함 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 |
| 웹사이트 | [www.bulksms.com](https://www.bulksms.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| 변수 | |
|---|---|
| `BULKSMS_TOKEN_ID` | API token ID |
| `BULKSMS_TOKEN_SECRET` | API token secret |
| `BULKSMS_FROM` | 선택 사항. 계정에 발신자가 있을 때 사용합니다 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- *Settings → API Tokens*에서 토큰을 만드세요. 드라이버는 이 토큰으로 HTTP Basic 인증을 합니다.

## 전송 보고서 {#delivery-reports}

BulkSMS의 전송 보고서 URL을 `https://your-app.com/laravel-sms/webhook/bulksms`로 지정하고 [웹훅](/ko/guide/webhooks)을 켜세요. 요청은 `BULKSMS_WEBHOOK_SECRET`을 사용해 `X-BulkSMS-Signature`의 HMAC-SHA256으로 검증합니다.

검증된 보고서는 `SmsWebhookReceived` 이벤트를 발생시킵니다.
