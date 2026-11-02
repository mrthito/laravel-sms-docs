# MSG91

<p class="lead">인도의 대표적인 게이트웨이입니다. 템플릿 메시지는 MSG91 Flow를 사용하며, Flow가 DLT 등록을 대신 처리해 줍니다.</p>

| | |
|---|---|
| 드라이버 키 | `msg91` |
| 지원 지역 | 인도 |
| 발송 방식 | 템플릿: 모든 수신자를 요청 하나로. 일반 본문: 수신자마다 요청 하나, 병렬로 발송 |
| 템플릿 | 지원 |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [msg91.com](https://msg91.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| 변수 | |
|---|---|
| `MSG91_AUTHKEY` | Auth key |
| `MSG91_SENDER` | DLT에 등록된 6자리 발신자 ID |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +919812345678 --provider=msg91
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 인도 규제(DLT)에 따라 모든 상업용 메시지는 등록된 템플릿과 일치해야 합니다. MSG91에서 Flow를 만든 뒤 `->template($flowId, ['otp' => 4821])`로 보내세요. 모든 수신자를 요청 하나로 보내며, 모든 수신자가 같은 변수 값을 받습니다.
- 일반 본문 메시지는 MSG91의 v2 API를 써서 수신자마다 요청 하나씩 보내며, 본문이 DLT 템플릿과 정확히 일치할 때만 인도 번호에 도달합니다.
