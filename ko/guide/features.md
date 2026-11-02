# 기능 한눈에 보기

<p class="lead">패키지가 하는 모든 일을 한 페이지에 모았습니다. 각 항목에서 자세한 설명이 있는 가이드로 바로 이동할 수 있습니다.</p>

## 발송 {#sending}

| | |
|---|---|
| **하나의 API, 제공업체 스무 곳** | Twilio, Vonage, Sinch, Bird, Plivo, Telnyx, Infobip, ClickSend, Clickatell, Brevo, Bandwidth, SendPulse, Amazon SNS, WhatsApp, MSG91, Sparrow SMS, Termii, Sendchamp, Africa's Talking, BulkSMS. [제공업체 →](/ko/providers/) |
| **플루언트 빌더** | `Sms::to()->message()->send()`. 호출할 때마다 새 메시지로 시작합니다. [메시지 작성 →](/ko/guide/sending) |
| **번호 정리** | 공백, 하이픈, 점, 괄호를 제거하고, 중복을 걸러 내고, 잘못된 번호는 보내기 전에 거부합니다. [수신자 →](/ko/guide/sending#recipients) |
| **발신자 변경** | 메시지마다 `->from('ACME')`로 지정. [발신자 →](/ko/guide/sending#sender) |
| **템플릿** | MSG91 Flow(DLT), WhatsApp 템플릿, Brevo 템플릿을 지원하며, 다른 제공업체에는 본문으로 대체 발송합니다. [템플릿 →](/ko/guide/templates) |
| **매크로** | 자주 보내는 메시지에 이름 붙이기: `Sms::sendOtp($phone, $code)`. [매크로 →](/ko/guide/sending#macros) |

## 안정성 {#reliability}

| | |
|---|---|
| **메시지 ID가 담긴 결과** | 발송할 때마다 접수된 수신자별로 제공업체의 ID를 돌려받습니다. [발송 결과 →](/ko/guide/results) |
| **정확한 실패 정보** | `DeliveryException`이 실패한 수신자와 성공한 수신자를 나눠서 알려 줍니다. [일부만 실패한 경우 →](/ko/guide/results#partial-failures) |
| **페일오버** | 제공업체를 체인으로 연결합니다. 거부된 수신자만 넘어가므로 같은 문자를 두 번 받는 사람이 없습니다. [페일오버 →](/ko/guide/failover) |
| **부하 분산** | 여러 제공업체에 메시지를 나눠 보냅니다. [부하 분산 →](/ko/guide/failover#load-balancing) |
| **큐** | `sendLater()`, `sendLaterAt()`. 수신자마다 암호화된 작업 하나씩, 재시도 포함. [큐로 보내기 →](/ko/guide/queueing) |

## 속도 {#speed}

| | |
|---|---|
| **대량 요청** | 대량 발송 엔드포인트가 있는 제공업체에는 모든 수신자를 호출 한 번에 보냅니다. [성능 →](/ko/guide/performance) |
| **병렬 요청** | 나머지 제공업체는 기본값으로 열 건씩 동시에 보냅니다. [성능 →](/ko/guide/performance#per-recipient-providers-in-parallel) |
| **토큰 캐싱** | OAuth 토큰을 만료될 때까지 재사용합니다. [토큰 캐싱 →](/ko/guide/performance#token-caching) |

## Laravel 통합 {#laravel-integration}

| | |
|---|---|
| **알림 채널** | `via()`에서 `'sms'`를 반환하고, `toSms()`에서 메시지를 반환합니다. [알림 →](/ko/guide/notifications) |
| **이벤트** | `SmsSending`(취소 가능), `SmsSent`, `SmsFailed`, `SmsWebhookReceived`. 리스너 클래스는 Laravel이 알아서 찾아 등록합니다. [이벤트 →](/ko/guide/events) |
| **웹훅** | WhatsApp, Termii, Sendchamp, Africa's Talking, BulkSMS의 서명된 전송 보고서. [웹훅 →](/ko/guide/webhooks) |
| **Artisan** | `php artisan sms:test`, 그리고 `php artisan about`의 전용 섹션. [Artisan →](/ko/reference/artisan) |
| **Octane과 큐에서도 안전** | 발송이나 요청 사이에 공유되는 상태가 없습니다. |

## 테스트 {#testing}

| | |
|---|---|
| **`Sms::fake()`** | 실제로 보내지 않고 메시지를 기록하며, 읽기 쉬운 어서션을 제공합니다. [테스트 →](/ko/guide/testing) |
| **`Http::fake()`** | 모든 HTTP 드라이버가 Laravel의 HTTP 클라이언트 위에서 동작합니다. [드라이버 테스트하기 →](/ko/guide/testing#testing-a-driver) |

## 보안 {#security}

| | |
|---|---|
| **기본적으로 닫힌 웹훅** | 서명이 없거나 검증할 수 없는 요청은 거부합니다. [웹훅 →](/ko/guide/webhooks) |
| **암호화된 큐 페이로드** | 코드와 번호를 `APP_KEY`로 암호화합니다. [큐로 보내기 →](/ko/guide/queueing#encrypted-at-rest) |
| **인증 정보 관리** | 예외 메시지, URL, 캐시 키에 시크릿을 남기지 않고, 로그의 번호는 가립니다. [보안 →](/ko/guide/security) |

## 확장 {#extending}

| | |
|---|---|
| **직접 만드는 드라이버** | `HttpDriver`를 상속하고 제공업체의 API만 기술하면 됩니다. [직접 만드는 드라이버 →](/ko/guide/custom-drivers) |
| **런타임 등록** | 서비스 프로바이더에서 `Sms::extend('acme', …)`. [런타임에 등록하기 →](/ko/guide/custom-drivers#registering-at-runtime) |
