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

To queue SMS notifications, implement `ShouldQueue` on the notification, as with any Laravel notification. Laravel creates one job per notifiable and channel, so the SMS and the email retry independently.

Send SMS jobs to their own queue with `viaQueues()`:

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

On Laravel 13, retry limits can be declared with attributes:

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

If the notification is sent inside a database transaction, chain `afterCommit()` so the text never goes out for an order that was rolled back:

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

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

    public function routeNotificationForSms(?Notification $notification = null): string
    {
        return $this->phone;
    }
}

$user->sms('Your order has shipped.');
$user->smsTemplate('otp', ['code' => 4821]);
```

Both send immediately and return the `SmsResult`. With the trait, keep the `$notification` parameter optional, as above, so the same method serves notifications and the helpers.
