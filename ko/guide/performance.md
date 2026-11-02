# 성능

<p class="lead">SMS 발송 시간은 대부분 제공업체의 응답을 기다리는 시간입니다. 이 패키지는 그 시간을 알뜰하게 씁니다. 제공업체가 허용하면 요청 수를 줄이고, 그렇지 않으면 요청을 병렬로 보냅니다.</p>

## 대량 발송 제공업체: 요청 한 번 {#bulk-providers-one-request}

다음 제공업체는 API 호출 한 번에 여러 수신자를 받으므로, 200명에게 보내는 메시지도 HTTP 요청 하나로 끝납니다.

**Sinch, Plivo, Infobip, ClickSend, Clickatell, Sparrow SMS, Sendchamp, Africa's Talking, BulkSMS, SendPulse**, 그리고 **MSG91** 템플릿.

Clickatell은 호출당 최대 100명까지 받으므로, 그보다 많으면 패키지가 자동으로 나눠서 보냅니다.

## 수신자별 제공업체: 병렬로 {#per-recipient-providers-in-parallel}

**Twilio, Vonage, Telnyx, Bird, Brevo, Bandwidth, WhatsApp, Termii**와 일반 텍스트 **MSG91**은 요청 하나에 수신자 한 명만 받습니다. 패키지는 요청이 끝나기를 하나씩 기다리지 않고, Laravel의 `Http::pool()`로 동시에 보냅니다.

기본값으로 한 번에 열 건씩 실행합니다.

```ini [.env]
SMS_HTTP_CONCURRENCY=10
```

제공업체 왕복이 300ms 정도라면, 100명에게 보내는 데 30초가 아니라 3초 남짓 걸립니다. 대량 발송이 많고 제공업체의 요청 한도가 허락한다면 값을 올리고, `429 Too Many Requests`가 보이면 낮추세요.

Amazon SNS는 AWS SDK를 통해 수신자 한 명씩 발행(publish)합니다.

## 타임아웃 {#timeouts}

```ini [.env]
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
```

연결 타임아웃은 제공업체에 연결할 수 없을 때 빠르게 실패하게 해 줍니다. 이는 [페일오버](/ko/guide/failover) 체인에서 특히 중요합니다. 하염없이 기다리는 대신 10초 뒤에 다음 제공업체로 넘어가기 때문입니다.

## 토큰 캐싱 {#token-caching}

Bandwidth와 SendPulse는 OAuth를 씁니다. 액세스 토큰은 만료 직전까지 Laravel 캐시 저장소에 캐시되므로, 대부분의 발송은 추가 왕복 없이 진행됩니다. 인증 정보를 교체한 직후처럼 제공업체가 토큰을 예정보다 일찍 거부하면, 캐시된 토큰을 버리고 다음 발송에서 새 토큰을 받아 옵니다.

## 애플리케이션에서 할 일 {#in-your-application}

- **웹 요청 중의 발송은 큐로 보내세요.** [큐](/ko/guide/queueing)를 쓰면 네트워크 대기 시간이 요청에서 완전히 빠집니다.
- **대량 발송에는 대량 발송 제공업체를 쓰세요.** 요청 하나가 수백 개보다 훨씬 잘 확장됩니다.
- **같은 내용은 한 번에 보내세요.** 메시지 하나를 500개 번호로 보내는 것이, 같은 본문을 500번 따로 보내는 것보다 훨씬 빠릅니다.
