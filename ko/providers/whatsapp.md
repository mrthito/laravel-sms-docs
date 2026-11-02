# WhatsApp

<p class="lead">SMS를 보낼 때와 같은 API로, Meta의 Cloud API를 통해 WhatsApp 메시지를 보냅니다. 자유 형식 본문과 승인된 템플릿을 모두 지원합니다.</p>

| | |
|---|---|
| 드라이버 키 | `whatsapp` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 |
| 전송 상태 웹훅 | 지원 |
| 웹사이트 | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| 변수 | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Manager의 전화번호 ID |
| `WHATSAPP_ACCESS_TOKEN` | 만료되지 않는 시스템 사용자 액세스 토큰 |
| `WHATSAPP_API_VERSION` | 선택 사항, 기본값 `v21.0` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | 선택 사항, 기본값 `en`. 템플릿의 언어 코드. 예: `en_US` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | 선택 사항. 국가 번호 없이 적힌 번호 앞에 붙입니다 |

실제 메시지를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- WhatsApp은 고객의 마지막 메시지로부터 24시간 안에만 자유 형식 본문을 허용합니다. 대화를 먼저 시작하려면 승인된 템플릿을 보내세요: `->template('order_update', ['Ana', '#4821'])`. 변수는 템플릿 본문의 파라미터를 순서대로 채웁니다.
- 시작 가이드 페이지에서 받는 임시 토큰은 하루가 지나면 만료되니, 시스템 사용자 토큰을 쓰세요.

## 전송 보고서 {#delivery-reports}

WhatsApp의 전송 보고서 URL을 `https://your-app.com/laravel-sms/webhook/whatsapp`로 지정하고 [웹훅](/ko/guide/webhooks)을 켜세요. 요청은 `X-Hub-Signature-256` HMAC(`WHATSAPP_WEBHOOK_SECRET`)로 검증하며, Meta의 구독 확인에는 `WHATSAPP_VERIFY_TOKEN`을 씁니다.

검증된 보고서는 `SmsWebhookReceived` 이벤트를 발생시킵니다.
