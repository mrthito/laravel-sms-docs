# Notifications

<p class="lead">If your app already sends mail through Laravel notifications, SMS is one more channel. The package registers it as <code>sms</code>.</p>

## Writing a notification

Add `sms` to `via()` and return the message from `toSms()`:

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

`toSms()` can also return a plain string when you don't need anything else:

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

To queue SMS notifications, implement `ShouldQueue` on the notification, as with any Laravel notification.

## Routing to a phone number

The channel asks the notifiable where to send. Add `routeNotificationForSms()` to your model:

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

If it returns `null` or an empty string, the SMS is skipped quietly. That's useful for users who haven't added a number.

A message that already has recipients is sent to them instead, and routing is skipped.

### On-demand notifications

Notify someone who isn't a user in your database:

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## The ready-made notification

For one-off messages, `SmsNotification` saves writing a class:

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## The HasSms trait

For quick sends straight from a model, add `HasSms`:

```php
use MrRijal\LaravelSms\Traits\HasSms;

class User extends Authenticatable
{
    use HasSms, Notifiable;

    public function routeNotificationForSms(): string
    {
        return $this->phone;
    }
}

$user->sms('Your order has shipped.');
$user->smsTemplate('otp', ['code' => 4821]);
```

Both send immediately and return the `SmsResult`.
