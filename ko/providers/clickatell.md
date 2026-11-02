# Clickatell

<p class="lead">오랜 역사를 지닌 게이트웨이로, 아프리카와 신흥 시장 전반에 걸쳐 커버리지가 깊습니다. Clickatell One API를 사용합니다.</p>

| | |
|---|---|
| 드라이버 키 | `clickatell` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.clickatell.com](https://www.clickatell.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| 변수 | |
|---|---|
| `CLICKATELL_API_KEY` | One API 연동의 API 키 |
| `CLICKATELL_FROM` | 선택 사항. 계정에 승인된 발신자가 있을 때 사용합니다 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- Clickatell은 요청 하나에 최대 100명까지 받습니다. 그보다 많으면 자동으로 나눠서 보냅니다.
- 수신자마다 개별적으로 접수 또는 거부되며, 거부 내역도 번호별로 보고됩니다.
