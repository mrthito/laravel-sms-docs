# Templates

<p class="lead">Some messages can't be free text. In India every commercial SMS must match a registered template, and WhatsApp only lets businesses start a conversation with an approved one. This page shows how to set templates up and send them.</p>

## When you need a template

| Situation | Why |
|---|---|
| Sending to Indian numbers | DLT regulations require every commercial message to match a template registered with the operators |
| Starting a WhatsApp conversation | Outside the 24 hours after a customer's last message, WhatsApp only delivers approved templates |
| Keeping copy out of code | Marketing or support teams can edit the wording in the provider's dashboard without a deploy |

Templates are supported by **[MSG91](/providers/msg91)**, **[WhatsApp](/providers/whatsapp)** and **[Brevo](/providers/brevo)**. Every other provider sends text.

## Sending a template

Pass the template's ID and its variables:

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

The ID and variables mean slightly different things to each provider.

## How each provider reads them

### MSG91 {#msg91}

The ID is the **Flow ID** from the MSG91 dashboard. Variable names must match the variables in your Flow, and every recipient receives the same values.

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

All recipients go out in a single request. Your sender ID (`MSG91_SENDER`) must be registered on DLT along with the template.

### WhatsApp {#whatsapp}

The ID is the **template name**, exactly as it appears in WhatsApp Manager. Variables fill the template's body placeholders **in order**: the first value replaces <code v-pre>{{1}}</code>, the second <code v-pre>{{2}}</code>, and so on. Array keys are only there for your own readability.

```php
// Template "order_update": "Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

Every message uses the language set in `WHATSAPP_TEMPLATE_LANGUAGE` (default `en`). It must match a language your template was approved in, such as `en_US` or `pt_BR`.

::: info Body text only
The driver fills body placeholders. Templates with header media, URL buttons or other components need the WhatsApp API directly, or a [custom driver](/guide/custom-drivers).
:::

### Brevo {#brevo}

The ID is the **SMS template ID** from Brevo, and variables become the template's `params`:

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## Templates with a text fallback

A message can carry a template **and** plain text. Template-capable providers send the template; every other provider sends the text. That makes templates safe to combine with [failover](/guide/failover):

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

MSG91 sends the DLT template. If it's unavailable, Twilio sends the text instead.

A template-only message sent to a text-only provider throws an `InvalidMessageException` naming the provider, before anything is sent. In a failover chain, that provider is simply skipped.

## Keeping template IDs out of your code

Template IDs are opaque strings that are easy to mistype. A backed enum gives each template a name, autocompletion, and one place to change it:

```php
namespace App\Enums;

enum SmsTemplate: string
{
    case LoginCode = '6512a8d3f1c2b';
    case OrderShipped = '6512a9e07a4d1';
}
```

```php
use App\Enums\SmsTemplate;

Sms::to($user->phone)
    ->template(SmsTemplate::LoginCode->value, ['otp' => $code])
    ->send();
```

If the IDs differ between environments, keep them in `config/services.php` and read them with `config('services.msg91.templates.login_code')` instead.

## Templates in notifications

`toSms()` can return a template message like any other:

```php
use App\Enums\SmsTemplate;
use MrRijal\LaravelSms\SmsMessage;

public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create()
        ->template(SmsTemplate::OrderShipped->value, ['order' => $this->order->number])
        ->provider('msg91');
}
```

Or use the ready-made notification:

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## Testing template messages

`Sms::fake()` records the template ID and variables, so you can assert on them:

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
