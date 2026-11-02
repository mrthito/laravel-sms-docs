# Plantillas

<p class="lead">Algunos mensajes no pueden ser texto libre. En India, cada SMS comercial debe coincidir con una plantilla registrada, y WhatsApp solo deja que una empresa inicie una conversación con una plantilla aprobada. Esta página explica cómo configurarlas y enviarlas.</p>

## Cuándo necesitas una plantilla {#when-you-need-a-template}

| Situación | Por qué |
|---|---|
| Envíos a números de India | La normativa DLT exige que cada mensaje comercial coincida con una plantilla registrada ante los operadores |
| Iniciar una conversación de WhatsApp | Fuera de las 24 horas siguientes al último mensaje del cliente, WhatsApp solo entrega plantillas aprobadas |
| Sacar los textos del código | Los equipos de marketing o soporte pueden cambiar la redacción en el panel del proveedor sin hacer un despliegue |

Admiten plantillas **[MSG91](/es/providers/msg91)**, **[WhatsApp](/es/providers/whatsapp)** y **[Brevo](/es/providers/brevo)**. Todos los demás proveedores envían texto.

## Enviar una plantilla {#sending-a-template}

Pasa el ID de la plantilla y sus variables:

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

El ID y las variables significan cosas ligeramente distintas para cada proveedor.

## Cómo los interpreta cada proveedor {#how-each-provider-reads-them}

### MSG91 {#msg91}

El ID es el **Flow ID** del panel de MSG91. Los nombres de las variables deben coincidir con las variables de tu Flow, y todos los destinatarios reciben los mismos valores.

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

Todos los destinatarios salen en una sola petición. Tu remitente (`MSG91_SENDER`) tiene que estar registrado en DLT junto con la plantilla.

### WhatsApp {#whatsapp}

El ID es el **nombre de la plantilla**, exactamente como aparece en WhatsApp Manager. Las variables rellenan los marcadores del cuerpo de la plantilla **en orden**: el primer valor sustituye a <code v-pre>{{1}}</code>, el segundo a <code v-pre>{{2}}</code>, y así sucesivamente. Las claves del array solo están para que tú lo leas mejor.

```php
// Plantilla "order_update": "Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

Todos los mensajes usan el idioma definido en `WHATSAPP_TEMPLATE_LANGUAGE` (`en` por defecto). Debe coincidir con un idioma en el que se haya aprobado tu plantilla, por ejemplo `en_US` o `pt_BR`.

::: info Solo el texto del cuerpo
El driver rellena los marcadores del cuerpo. Las plantillas con multimedia en el encabezado, botones con URL u otros componentes necesitan usar directamente la API de WhatsApp o un [driver propio](/es/guide/custom-drivers).
:::

### Brevo {#brevo}

El ID es el **ID de la plantilla de SMS** de Brevo, y las variables se convierten en los `params` de la plantilla:

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## Plantillas con texto de respaldo {#templates-with-a-text-fallback}

Un mensaje puede llevar una plantilla **y** texto normal. Los proveedores que admiten plantillas envían la plantilla; todos los demás envían el texto. Por eso las plantillas se pueden combinar sin riesgo con el [failover](/es/guide/failover):

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

MSG91 envía la plantilla DLT. Si no está disponible, Twilio envía el texto en su lugar.

Si un mensaje que solo tiene plantilla se envía a un proveedor que solo acepta texto, se lanza una `InvalidMessageException` que indica el proveedor, antes de enviar nada. En una cadena de failover, ese proveedor simplemente se salta.

## Sacar los IDs de plantilla del código {#keeping-template-ids-out-of-your-code}

Los IDs de plantilla son cadenas opacas y es fácil escribirlos mal. Un backed enum le da a cada plantilla un nombre, autocompletado y un único sitio donde cambiarla:

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

Si los IDs cambian de un entorno a otro, guárdalos en `config/services.php` y léelos con `config('services.msg91.templates.login_code')`.

## Plantillas en notificaciones {#templates-in-notifications}

`toSms()` puede devolver un mensaje con plantilla como cualquier otro:

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

O usa la notificación ya hecha:

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## Probar mensajes con plantilla {#testing-template-messages}

`Sms::fake()` registra el ID de la plantilla y sus variables, así que puedes hacer aserciones sobre ellos:

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
