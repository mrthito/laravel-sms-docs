# 환경 변수

<p class="lead">패키지가 <code>.env</code>에서 읽는 모든 설정을 한곳에 모았습니다. 사용할 제공업체의 블록을 복사해 값을 채운 뒤, <code>php artisan sms:test</code>로 확인하세요.</p>

## 전체 구조 {#how-it-fits-together}

`config/sms.php`는 모든 값을 `env()`로 읽으므로, 패키지 설정은 `.env`만으로 끝납니다. 몇 가지 규칙만 지키면 수월합니다.

- **쓰는 것만 설정하세요.** 제공업체의 변수는 그 제공업체로 보낼 때만 읽습니다. 쓰지 않는 제공업체는 아무것도 설정할 필요가 없습니다.
- **공백이나 `#`이 들어간 값은 따옴표로 감싸세요.** `TWILIO_FROM=ACME Alerts`가 아니라 `TWILIO_FROM="ACME Alerts"`처럼 씁니다.
- **프로덕션에서는 캐시하세요.** 서버에서 `.env`를 바꾼 뒤에는 `php artisan config:cache`를 실행해야 합니다. 그렇지 않으면 이전 값이 계속 적용됩니다.
- **시크릿은 git에 넣지 마세요.** 값을 비운 `.env.example`만 커밋하고, 실제 `.env`는 절대 커밋하지 마세요. Laravel Cloud, Forge, Vapor에서는 환경 설정 화면에서 값을 지정하세요.

## 공통 설정 {#general-settings}

모든 제공업체에 적용되며, 전부 선택 사항입니다.

```ini [.env]
# 기본 발송 제공업체: 제공업체 키, "failover", "random" 중 하나
SMS_PROVIDER=twilio

# 페일오버 체인. 왼쪽부터 차례로 시도 (SMS_PROVIDER=failover일 때 사용)
SMS_FAILOVER_DRIVERS=twilio,vonage

# send()를 즉시 보내지 않고 모두 큐에 넣기
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # 큐의 retry_after는 이 값보다 크게 유지하세요

# 제공업체 HTTP 호출
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # 수신자별 제공업체의 동시 요청 수

# Log 드라이버 (개발 전용)
SMS_LOG_CHANNEL=
```

각 설정의 자세한 동작은 [설정](/ko/reference/configuration)을 참고하세요.

## 글로벌 제공업체 {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID. AC로 시작
TWILIO_TOKEN=                  # Auth token
TWILIO_FROM=                   # 발신 번호 또는 영숫자 ID
TWILIO_MESSAGING_SERVICE_SID=  # 선택 사항. 발신자 하나 대신 Messaging Service 사용 (MG로 시작)
```

[Twilio 가이드 →](/ko/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # API key
VONAGE_SECRET=  # API secret
VONAGE_FROM=    # 발신 번호 또는 영숫자 ID
```

[Vonage 가이드 →](/ko/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # SMS 대시보드의 Service plan ID
SINCH_API_TOKEN=        # 해당 service plan의 API 토큰
SINCH_FROM=             # 발신 번호 또는 영숫자 ID
SINCH_REGION=           # us(기본값), eu, au, br, ca 중 하나. 계정이 있는 리전과 일치해야 함
```

[Sinch 가이드 →](/ko/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # 워크스페이스 API 키. bk_로 시작
BIRD_FROM=      # 발신 번호 또는 영숫자 ID
BIRD_REGION=    # us1(기본값) 또는 eu1. 키와 일치해야 함
BIRD_CATEGORY=  # transactional(기본값), marketing, authentication, service 중 하나
```

[Bird 가이드 →](/ko/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth token
PLIVO_FROM=          # 발신 번호 또는 영숫자 ID
PLIVO_LOG_MESSAGES=  # 선택 사항, 기본값 false. Plivo가 메시지 내용과 번호를 자체 로그에 저장할지 여부
```

[Plivo 가이드 →](/ko/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # API 키 (v2)
TELNYX_FROM=                  # 발신 번호
TELNYX_MESSAGING_PROFILE_ID=  # 선택 사항. 발신자 하나 대신 messaging profile과 그 번호 풀 사용
```

[Telnyx 가이드 →](/ko/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # API 키
INFOBIP_SENDER=    # 발신 번호 또는 영숫자 ID
INFOBIP_BASE_URL=  # Infobip 포털에 표시된 개인 기본 URL. 예: https://xyz123.api.infobip.com
```

[Infobip 가이드 →](/ko/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # ClickSend 사용자 이름
CLICKSEND_API_KEY=   # 대시보드의 API 키
CLICKSEND_FROM=      # 선택 사항. 비워 두면 ClickSend 공유 번호 사용
```

[ClickSend 가이드 →](/ko/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # One API 연동의 API 키
CLICKATELL_FROM=     # 선택 사항. 계정에 승인된 발신자가 있을 때
```

[Clickatell 가이드 →](/ko/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # API 키 (v3)
BREVO_SMS_SENDER=  # 발신자 이름(최대 11자) 또는 번호
BREVO_SMS_TYPE=    # transactional(기본값) 또는 marketing
```

[Brevo 가이드 →](/ko/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # Account ID
BANDWIDTH_APPLICATION_ID=  # 번호에 연결된 메시징 애플리케이션
BANDWIDTH_CLIENT_ID=       # OAuth client ID
BANDWIDTH_CLIENT_SECRET=   # OAuth client secret
BANDWIDTH_FROM=            # 해당 애플리케이션에 할당된 Bandwidth 번호
```

[Bandwidth 가이드 →](/ko/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # REST API ID
SENDPULSE_CLIENT_SECRET=  # REST API secret
SENDPULSE_SENDER=         # 승인된 발신자 이름 (최대 11자)
```

[SendPulse 가이드 →](/ko/providers/sendpulse)

### Amazon SNS {#aws-sns}

먼저 AWS SDK를 설치해야 합니다: `composer require aws/aws-sdk-php`.

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # 발송할 리전. 예: us-east-1
AWS_ACCESS_KEY_ID=      # 선택 사항. 생략하면 기본 자격 증명 체인 사용
AWS_SECRET_ACCESS_KEY=  # 선택 사항. 위 키와 함께 설정
AWS_SNS_SENDER_ID=      # 선택 사항. 영숫자 발신자 ID
AWS_SNS_SMS_TYPE=       # Transactional(기본값) 또는 Promotional
```

[Amazon SNS 가이드 →](/ko/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # WhatsApp Manager의 전화번호 ID
WHATSAPP_ACCESS_TOKEN=          # 만료되지 않는 시스템 사용자 액세스 토큰
WHATSAPP_API_VERSION=           # 선택 사항, 기본값 v21.0
WHATSAPP_TEMPLATE_LANGUAGE=     # 선택 사항, 기본값 en. 템플릿의 언어 코드. 예: en_US
WHATSAPP_DEFAULT_COUNTRY_CODE=  # 선택 사항. 국가 번호 없이 적힌 번호 앞에 붙임
```

[WhatsApp 가이드 →](/ko/providers/whatsapp)

## 지역 특화 제공업체 {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth key
MSG91_SENDER=   # DLT에 등록된 6자리 발신자 ID
```

[MSG91 가이드 →](/ko/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # API 토큰
SPARROW_FROM=   # 승인된 identity (발신자)
```

[Sparrow SMS 가이드 →](/ko/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # API 키
TERMII_SENDER_ID=  # 승인된 발신자 ID
TERMII_CHANNEL=    # generic(기본값), DND 등록 번호용 dnd, 또는 whatsapp
TERMII_BASE_URL=   # 선택 사항. Termii 대시보드에 표시된 계정 기본 URL. HTTPS만 허용
```

[Termii 가이드 →](/ko/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # Public access key
SENDCHAMP_SENDER_NAME=  # 승인된 발신자 이름
SENDCHAMP_ROUTE=        # dnd(기본값), non_dnd, international 중 하나
```

[Sendchamp 가이드 →](/ko/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # API 키
AFRICASTALKING_USERNAME=  # 앱 사용자 이름 (테스트 중에는 sandbox)
AFRICASTALKING_FROM=      # 선택 사항. 발신자 ID 또는 단축 번호
AFRICASTALKING_SANDBOX=   # sandbox API를 쓰려면 true
```

[Africa's Talking 가이드 →](/ko/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # API token ID
BULKSMS_TOKEN_SECRET=  # API token secret
BULKSMS_FROM=          # 선택 사항. 계정에 발신자가 있을 때
```

[BulkSMS 가이드 →](/ko/providers/bulksms)

## 웹훅 시크릿 {#webhook-secrets}

전송 보고서를 받을 때만 필요합니다. 각 시크릿은 해당 제공업체에 필수이며, 없으면 그 제공업체의 웹훅은 거부됩니다. [웹훅](/ko/guide/webhooks)을 참고하세요.

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # 임의의 무작위 문자열. Meta 대시보드에도 같은 값을 입력
WHATSAPP_WEBHOOK_SECRET=        # Meta 앱 시크릿
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # 콜백 URL에도 ?token=으로 추가
```

직접 정하는 시크릿은 `php -r "echo bin2hex(random_bytes(24));"`로 생성하세요.

## 전체 예시 {#a-complete-example}

실제 프로덕션에 가까운 구성입니다. Twilio를 먼저 쓰고 Vonage를 백업으로 두며, 모든 발송을 큐에 넣고, WhatsApp 전송 보고서를 받습니다.

```ini [.env]
SMS_PROVIDER=failover
SMS_FAILOVER_DRIVERS=twilio,vonage

SMS_QUEUE=true
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=ACME

SMS_WEBHOOKS_ENABLED=true
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_WEBHOOK_SECRET=
```

그런 다음 체인의 제공업체를 하나씩 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
