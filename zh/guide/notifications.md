# 通知

<p class="lead">如果你的应用已经在用 Laravel 通知发邮件，那短信不过是多一个渠道。扩展包把它注册为 <code>sms</code>。</p>

## 编写通知 {#writing-a-notification}

在 `via()` 中加上 `sms`，再在 `toSms()` 中返回短信：

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

如果不需要别的设置，`toSms()` 也可以直接返回一个字符串：

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

要让短信通知走队列，和其他 Laravel 通知一样，让通知类实现 `ShouldQueue` 即可。Laravel 会为每个可通知对象的每个渠道各创建一个任务，所以短信和邮件各自独立重试。

用 `viaQueues()` 把短信任务发到单独的队列：

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

在 Laravel 13 中，可以用注解（attribute）声明重试次数：

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

如果通知是在数据库事务中发送的，链式调用 `afterCommit()`，这样订单被回滚时就不会发出短信：

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

## 路由到手机号 {#routing-to-a-phone-number}

渠道会询问可通知对象（notifiable）要发到哪里。在模型中添加 `routeNotificationForSms()`：

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

如果它返回 `null` 或空字符串，这条短信会被静默跳过。对还没填写手机号的用户来说，这很实用。

如果短信本身已经指定了收件人，就直接发给这些收件人，不再走路由。

### 按需通知 {#on-demand-notifications}

给不在你数据库里的人发通知：

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## 现成的通知类 {#the-ready-made-notification}

发一次性短信时，用 `SmsNotification` 就不必专门写一个类：

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## HasSms trait {#the-hassms-trait}

想直接在模型上快速发短信，加上 `HasSms`：

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

两者都会立即发送，并返回 `SmsResult`。使用这个 trait 时，请像上面那样让 `$notification` 参数保持可选，这样同一个方法既能服务于通知，也能服务于这两个辅助方法。
