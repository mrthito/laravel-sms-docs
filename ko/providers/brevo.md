# Brevo

<p class="lead">예전 이름은 Sendinblue입니다. 이미 Brevo로 이메일을 보내고 있고, 계정 하나로 이메일과 문자를 함께 관리하고 싶다면 잘 맞습니다.</p>

| | |
|---|---|
| 드라이버 키 | `brevo` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.brevo.com](https://www.brevo.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| 변수 | |
|---|---|
| `BREVO_API_KEY` | API 키 (v3) |
| `BREVO_SMS_SENDER` | 발신자 이름(최대 11자) 또는 번호 |
| `BREVO_SMS_TYPE` | `transactional`(기본값) 또는 `marketing` |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- Brevo SMS 템플릿을 지원합니다. `->template('12', ['code' => 4821])`처럼 템플릿 ID와 파라미터를 넘기세요.
- 마케팅 문자에는 수신 거부 방법을 반드시 포함해야 하며, 일부 국가에서는 야간 발송 제한이 적용됩니다. 인증 코드나 영수증에는 `transactional`을 쓰세요.
