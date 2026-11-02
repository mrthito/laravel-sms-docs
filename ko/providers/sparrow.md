# Sparrow SMS

<p class="lead">네팔에서 가장 널리 쓰이는 SMS 게이트웨이로, NTC와 Ncell 모두에 직접 연결되어 있습니다.</p>

| | |
|---|---|
| 드라이버 키 | `sparrow` |
| 지원 지역 | 네팔 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [sparrowsms.com](https://sparrowsms.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| 변수 | |
|---|---|
| `SPARROW_TOKEN` | API 토큰 |
| `SPARROW_FROM` | 승인된 identity (발신자) |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +9779812345678 --provider=sparrow
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+9779812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- 모든 수신자를 요청 하나로 보냅니다.
- 네팔 번호는 국가 번호를 붙여(`+97798…`) 쓰거나 10자리 국내 휴대폰 번호(`98…`)로 써도 됩니다. 둘 다 받아들입니다.
