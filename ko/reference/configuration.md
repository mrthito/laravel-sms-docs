# 설정

<p class="lead"><code>config/sms.php</code>의 모든 옵션과, 각 옵션을 지정하는 환경 변수를 정리했습니다. 설정 파일은 <code>php artisan vendor:publish --tag=sms-config</code>로 퍼블리시하며, 직접 고칠 일은 거의 없습니다.</p>

## 발송 {#sending}

| 옵션 | 환경 변수 | 기본값 | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | 메시지에 제공업체를 지정하지 않았을 때 쓰는 제공업체. `failover`와 `random`도 쓸 수 있습니다. |
| `random_drivers` | — | `['twilio', 'msg91']` | `random`이 고르는 제공업체 풀. |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | `failover`가 순서대로 시도할 체인. 쉼표로 구분합니다. |

## 큐 {#queueing}

| 옵션 | 환경 변수 | 기본값 | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | `true`이면 `send()`가 즉시 보내지 않고 큐에 넣습니다. |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | 애플리케이션 기본값 | SMS 작업에 쓸 큐 연결. |
| `queue_name` | `SMS_QUEUE_NAME` | 애플리케이션 기본값 | SMS 작업에 쓸 큐 이름. |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | 작업이 실패로 처리되기 전까지 수신자당 시도 횟수. |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | 작업이 실행될 수 있는 최대 시간(초). 큐의 `retry_after`는 이 값보다 크게 두세요. |
| `retry.backoff` | — | `[10, 30, 60]` | 재시도 전에 기다릴 시간(초). |

## HTTP {#http}

| 옵션 | 환경 변수 | 기본값 | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | 제공업체의 응답을 기다릴 시간(초). |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | 연결을 기다릴 시간(초). |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | 수신자별 제공업체에 보내는 동시 요청 수. |

## 웹훅 {#webhooks}

| 옵션 | 환경 변수 | 기본값 | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | 웹훅 라우트를 등록합니다. |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | URL 접두사. 뒤에 제공업체 키가 붙습니다. |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | 라우트에 적용할 미들웨어. |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | Meta 앱 시크릿. |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | Meta의 구독 확인에 쓰는 토큰. |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | 콜백 URL에 `?token=`으로 전달합니다. |

## 드라이버와 제공업체 {#drivers-and-providers}

두 개의 맵이 제공업체 키를 해당 코드와 인증 정보에 연결합니다.

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

`drivers`는 어떤 클래스가 키를 처리할지 정하고, `providers`는 그 키의 설정을 담아 클래스에 넘겨줍니다. 각 [제공업체 페이지](/ko/providers/)에 설정 항목이 정리되어 있습니다.

트랜잭션용과 마케팅용처럼 같은 제공업체를 계정 두 개로 쓰려면, 같은 클래스를 다른 키로 두 번 등록하세요.

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## 설정 캐시 {#config-caching}

설정에 클로저가 없으므로 `php artisan config:cache`가 평소처럼 동작합니다. 프로덕션에서 `.env`를 바꾼 뒤에는 다시 실행하세요.
