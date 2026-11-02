# 1.x에서 업그레이드

<p class="lead">버전 2는 true/false 대신 발송 결과를 중심으로 핵심부를 다시 만들었습니다. 대부분의 애플리케이션은 처음 세 단계만 하면 되며, 30분 정도 걸립니다.</p>

## 1. 패키지 업데이트 {#_1-update-the-package}

```bash
composer require mr-rijal/laravel-sms:^2.0
```

**AWS SNS** 드라이버를 쓴다면, 이제 AWS SDK가 자동으로 설치되지 않습니다.

```bash
composer require aws/aws-sdk-php
```

## 2. 설정 파일 다시 퍼블리시 또는 병합 {#_2-re-publish-or-merge-the-config}

```bash
php artisan vendor:publish --tag=sms-config --force
```

`config/sms.php`를 직접 수정해 두었다면 다음 변경 사항을 손으로 병합하세요.

- `default`의 대체값이 `fake`에서 `log`로 바뀌었습니다.
- 새 섹션: `retry`, `http`, `providers.failover`.
- 새 제공업체: `sinch`, `bird`, `clicksend`, `clickatell`, `brevo`, `bandwidth`, `sendpulse`.
- 제거된 제공업체: `telegram_mirror`, `discord_webhook`, `slack_webhook`.

## 3. true/false 대신 발송 결과 받기 {#_3-send-results-instead-of-booleans}

`send()`, `sendNow()`, `HasSms` 헬퍼는 이제 `bool` 대신 `?SmsResult`를 반환합니다.

```php
// 1.x
if (Sms::to($n)->message('Hi')->sendNow()) { ... }

// 2.0
$result = Sms::to($n)->message('Hi')->sendNow();
$result?->firstId();
```

`SmsSending` 리스너가 발송을 취소했거나 `send()`가 메시지를 큐에 넣었을 때 결과는 `null`입니다. 실패하면 1.x와 마찬가지로 예외를 던집니다.

## 제거된 드라이버 {#removed-drivers}

Telegram, Discord, Slack 미러 드라이버는 제거되었습니다. 애초에 SMS를 보내는 드라이버가 아니었기 때문입니다. 내부 알림용으로 쓰고 있었다면, 대신 `SmsSent` 이벤트를 리스닝해서 Laravel 알림으로 해당 채널에 게시하세요.

## 예외 {#exceptions}

제공업체 실패는 `MrRijal\LaravelSms\Exceptions\DeliveryException`(여전히 `RuntimeException`)을 던집니다. 잘못된 입력은 `InvalidMessageException`을, 잘못된 설정은 `InvalidConfigurationException`을 던집니다(둘 다 여전히 `InvalidArgumentException`). 모두 처리하려면 `MrRijal\LaravelSms\Exceptions\SmsException`을 catch하세요.

`DeliveryException::$failedRecipients`와 `DeliveryException::$partial`로 누가 메시지를 받았고 누가 받지 못했는지 알 수 있습니다.

## 이벤트 {#events}

- `SmsSent`에서 `success`와 `error` 속성이 없어졌습니다. 이제 성공했을 때만 발생하며 `result`(`SmsResult`)를 담고 있습니다.
- 실패하면 `exception`을 담은 새 `SmsFailed` 이벤트가 발생합니다.
- 이제 `SmsSending` 리스너에서 `false`를 반환해 발송을 취소할 수 있습니다.

## 알림 {#notifications}

`toSms()`는 이제 메시지를 직접 보내는 대신 `SmsMessage`(또는 문자열)를 **반환**해야 합니다. 채널은 `routeNotificationForSms()`로 라우팅하며, `Notification::route('sms', $number)`도 지원합니다.

```php
// 1.x
public function toSms($notifiable): void
{
    Sms::to($notifiable->phone)->message('Shipped')->sendNow();
}

// 2.0
public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create('Shipped');
}
```

`SmsNotification`은 더 이상 `sms.queue`를 읽지 않습니다. 알림을 큐로 보내려면 다른 Laravel 알림과 마찬가지로 알림 클래스에 `ShouldQueue`를 구현하세요.

## 파사드와 매니저 {#facade-and-manager}

- `Sms::to()`, `Sms::provider()`, `Sms::message()`, `Sms::template()`은 이제 호출할 때마다 새 `PendingSms`를 반환하므로, 발송 사이에 상태가 공유되지 않습니다.
- `Sms::sendMessage($message, $provider)`는 `Sms::sendNow($message->provider($provider))`로 대체되었습니다.
- `SmsManager`는 컨테이너를 받아 생성됩니다. `new SmsManager`로 직접 만들지 말고 컨테이너에서 꺼내 쓰세요(`app(SmsManager::class)`).

## 직접 만든 드라이버 {#custom-drivers}

`SmsProvider::send()`는 이제 `SmsResult`를 반환해야 합니다.

```php
public function send(SmsMessage $message): SmsResult
{
    // ... 제공업체 호출 ...

    return SmsResult::accepted($message->getTo(), $providerMessageId);
}
```

`MrRijal\LaravelSms\Drivers\HttpDriver`를 상속하면 설정 검증, 타임아웃, 동시 발송, 일부 실패 처리, 안전한 오류 메시지를 덤으로 얻습니다. 이제 드라이버는 Laravel의 HTTP 클라이언트를 쓰므로 생성자에서 Guzzle `Client`를 받지 않습니다. 테스트에서는 `Http::fake()`를 쓰세요.

## 테스트 {#testing}

`FakeDriver::$messages` 어서션은 `Sms::fake()`로 바꾸세요.

```php
Sms::fake();
// ...
Sms::assertSentTo('+15551234567');
```

`FakeDriver`에 의존하는 앱을 위해 `FakeDriver`는 아직 남아 있습니다.
