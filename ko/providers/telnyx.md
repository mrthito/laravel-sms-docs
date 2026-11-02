# Telnyx

<p class="lead">자체 전용 네트워크를 운영하는 개발자 중심의 통신사입니다. 미국에서 가격 경쟁력이 좋습니다.</p>

| | |
|---|---|
| 드라이버 키 | `telnyx` |
| 지원 지역 | 전 세계 |
| 발송 방식 | 수신자마다 요청 하나, [병렬로](/ko/guide/performance) 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [telnyx.com](https://telnyx.com) |

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| 변수 | |
|---|---|
| `TELNYX_API_KEY` | API 키 (v2) |
| `TELNYX_FROM` | 발신 번호 |
| `TELNYX_MESSAGING_PROFILE_ID` | 선택 사항. 발신자 하나 대신 messaging profile과 그 번호 풀을 사용합니다 |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- `TELNYX_FROM`과 `TELNYX_MESSAGING_PROFILE_ID` 중 하나는 반드시 있어야 합니다.
- 미국 번호는 10DLC 등록을 마쳐야 Telnyx가 A2P(애플리케이션→사람) 문자를 전달합니다.
