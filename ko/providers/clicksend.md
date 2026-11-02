# ClickSend

<p class="lead">호주, 영국, 미국에서 인기 있는 서비스입니다. 대시보드가 깔끔하고, 모든 응답에 메시지별 상태가 담깁니다.</p>

| | |
|---|---|
| 드라이버 키 | `clicksend` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.clicksend.com](https://www.clicksend.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| 변수 | |
|---|---|
| `CLICKSEND_USERNAME` | ClickSend 사용자 이름 |
| `CLICKSEND_API_KEY` | 대시보드의 API 키 |
| `CLICKSEND_FROM` | 선택 사항. 비워 두면 ClickSend의 공유 번호를 사용합니다 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- ClickSend는 수신자마다 결과를 따로 알려 줍니다. 일부가 거부되면 정확히 그 번호들이 담긴 `DeliveryException`과, 나머지 수신자에 대한 `partial` 결과를 받게 됩니다.
