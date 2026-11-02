# Termii

<p class="lead">나이지리아에서 인기 있는 플랫폼으로, DND 규정을 준수하는 경로를 갖추고 있으며 같은 계정으로 WhatsApp 전송도 할 수 있습니다.</p>

| | |
|---|---|
| 드라이버 키 | `termii` |
| 지원 지역 | 나이지리아 및 아프리카 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 |
| 웹사이트 | [termii.com](https://termii.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| 변수 | |
|---|---|
| `TERMII_API_KEY` | API 키 |
| `TERMII_SENDER_ID` | 승인된 발신자 ID |
| `TERMII_CHANNEL` | `generic`(기본값), DND(수신 거부) 등록 번호용 `dnd`, 또는 `whatsapp` |
| `TERMII_BASE_URL` | 선택 사항. Termii 대시보드에 표시된 계정 기본 URL. HTTPS만 허용합니다 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +2348012345678 --provider=termii
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- OTP 같은 트랜잭션 메시지에는 `dnd` 채널을 쓰세요. 나이지리아에서는 `generic` 경로로는 DND에 등록한 번호에 도달하지 못합니다.
- Termii는 요청 본문에 담긴 API 키로 인증합니다. 드라이버는 이 키를 HTTPS로만 보냅니다.

## 전송 보고서 {#delivery-reports}

Termii의 전송 보고서 URL을 `https://your-app.com/laravel-sms/webhook/termii`로 지정하고 [웹훅](/ko/guide/webhooks)을 켜세요. 요청은 `TERMII_WEBHOOK_SECRET`을 사용해 `X-Termii-Signature`의 HMAC-SHA512로 검증합니다.

검증된 보고서는 `SmsWebhookReceived` 이벤트를 발생시킵니다.
