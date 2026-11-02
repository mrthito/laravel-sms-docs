# Infobip

<p class="lead">통신사 연결 범위가 매우 넓은 엔터프라이즈 플랫폼으로, 특히 유럽, 중동, 아프리카에 강합니다. SMS API v3를 사용합니다.</p>

| | |
|---|---|
| 드라이버 키 | `infobip` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 모든 수신자를 요청 하나로 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [www.infobip.com](https://www.infobip.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| 변수 | |
|---|---|
| `INFOBIP_API_KEY` | API 키 |
| `INFOBIP_SENDER` | 발신 번호 또는 영숫자 ID |
| `INFOBIP_BASE_URL` | Infobip 포털에 표시된 개인 기본 URL. 예: `https://xyz123.api.infobip.com` |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- Infobip 계정 홈페이지에 표시된 **개인 기본 URL**을 쓰세요. Infobip은 이 URL을 통해 트래픽을 라우팅하며, 고객 지원에 문의할 때도 이 URL을 묻습니다.
- 기본 URL은 반드시 HTTPS여야 합니다. 그렇지 않으면 드라이버를 불러올 때 거부됩니다.
