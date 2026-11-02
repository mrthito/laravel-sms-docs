# 알림

<p class="lead">이미 Laravel 알림으로 메일을 보내고 있다면, SMS는 채널 하나가 더 늘어나는 것뿐입니다. 패키지가 <code>sms</code>라는 이름으로 채널을 등록합니다.</p>

## 알림 작성하기 {#writing-a-notification}

`via()`에 `sms`를 추가하고 `toSms()`에서 메시지를 반환하세요.

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.")
            ->from('ACME');
    }
}
```

다른 설정이 필요 없다면 `toSms()`에서 문자열을 그대로 반환해도 됩니다.

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

SMS 알림을 큐로 보내려면 다른 Laravel 알림과 마찬가지로 알림 클래스에 `ShouldQueue`를 구현하세요. Laravel은 알림 대상과 채널마다 작업을 하나씩 만들기 때문에, SMS와 이메일은 각각 따로 재시도됩니다.

`viaQueues()`로 SMS 작업을 전용 큐에 보낼 수 있습니다.

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

Laravel 13에서는 재시도 횟수를 어트리뷰트로 선언할 수 있습니다.

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

데이터베이스 트랜잭션 안에서 알림을 보낸다면 `afterCommit()`을 체이닝하세요. 롤백된 주문에 대해 문자가 나가는 일을 막아 줍니다.

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

## 전화번호로 라우팅하기 {#routing-to-a-phone-number}

채널은 알림을 받을 대상(notifiable)에게 어디로 보낼지 묻습니다. 모델에 `routeNotificationForSms()`를 추가하세요.

```php
class User extends Authenticatable
{
    use Notifiable;

    public function routeNotificationForSms(Notification $notification): ?string
    {
        return $this->phone;
    }
}
```

`null`이나 빈 문자열을 반환하면 SMS는 조용히 건너뜁니다. 아직 번호를 등록하지 않은 사용자에게 유용합니다.

메시지에 이미 수신자가 지정되어 있다면 라우팅을 건너뛰고 그 수신자에게 보냅니다.

### 온디맨드 알림 {#on-demand-notifications}

데이터베이스에 사용자로 등록되지 않은 사람에게도 알림을 보낼 수 있습니다.

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## 기본 제공 알림 {#the-ready-made-notification}

한 번만 보내는 메시지라면 `SmsNotification`을 쓰면 클래스를 따로 만들 필요가 없습니다.

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## HasSms 트레이트 {#the-hassms-trait}

모델에서 바로 간단히 보내려면 `HasSms`를 추가하세요.

```php
use MrRijal\LaravelSms\Traits\HasSms;

class User extends Authenticatable
{
    use HasSms, Notifiable;

    public function routeNotificationForSms(?Notification $notification = null): string
    {
        return $this->phone;
    }
}

$user->sms('Your order has shipped.');
$user->smsTemplate('otp', ['code' => 4821]);
```

두 메서드 모두 즉시 발송하고 `SmsResult`를 반환합니다. 트레이트를 쓸 때는 위처럼 `$notification` 파라미터를 선택 사항으로 두세요. 그래야 같은 메서드 하나로 알림과 헬퍼 메서드를 모두 처리할 수 있습니다.
