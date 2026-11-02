# Africa's Talking

<p class="lead">아프리카 20여 개국 이상의 통신사와 직접 연결되어 있으며, 개발용 무료 샌드박스를 제공합니다.</p>

| | |
|---|---|
| 드라이버 키 | `africastalking` |
| 지원 지역 | 아프리카 전역 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 |
| 웹사이트 | [africastalking.com](https://africastalking.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| 변수 | |
|---|---|
| `AFRICASTALKING_API_KEY` | API 키 |
| `AFRICASTALKING_USERNAME` | 앱 사용자 이름 (테스트 중에는 `sandbox`) |
| `AFRICASTALKING_FROM` | 선택 사항. 발신자 ID 또는 단축 번호 |
| `AFRICASTALKING_SANDBOX` | 샌드박스 API를 쓰려면 `true` |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 샌드박스 모드에서는 메시지가 실제 휴대폰이 아니라 Africa's Talking 시뮬레이터에 표시됩니다. `AFRICASTALKING_USERNAME=sandbox`와 `AFRICASTALKING_SANDBOX=true`를 함께 설정하세요.
- Africa's Talking은 수신자별 상태를 알려 줍니다. 잔액 부족 등으로 거부된 번호는 `DeliveryException`에 담깁니다.

## 전송 보고서 {#delivery-reports}

Africa's Talking의 전송 보고서 URL을 `https://your-app.com/laravel-sms/webhook/africastalking`으로 지정하고 [웹훅](/ko/guide/webhooks)을 켜세요. Africa's Talking은 콜백에 서명하지 않으므로, 요청은 `AFRICASTALKING_WEBHOOK_SECRET`을 사용해 콜백 URL의 `?token=` 시크릿으로 검증합니다.

검증된 보고서는 `SmsWebhookReceived` 이벤트를 발생시킵니다.
