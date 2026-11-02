# Your first message

<p class="lead">A guided tour of the five things you'll do most: send, check the result, queue, notify and test.</p>

## Send a message

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

Numbers may contain spaces, dashes, dots and parentheses: `+1 (555) 123-4567` and `+15551234567` are the same recipient. Use the international format with a leading `+` wherever you can. Most providers need it to route the message.

## Check what happened

`sendNow()` sends immediately and returns an `SmsResult`:

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // the provider's message ID, worth storing
```

If the provider rejects the message, a `DeliveryException` tells you why:

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

[Results and errors](/guide/results) covers partial failures and what each property holds.

## Queue it

Sending takes a network round trip. Inside a web request, queue the message so your users don't wait for it:

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## Send it as a notification

If you already use Laravel notifications, add the `sms` channel:

```php
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.");
    }
}
```

The channel asks your model for a number through `routeNotificationForSms()`. [Notifications](/guide/notifications) has the details.

## Test it

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

That's the core of the package. The rest of this guide goes deeper into each part, starting with [composing messages](/guide/sending).
