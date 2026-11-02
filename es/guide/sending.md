# Redactar mensajes

<p class="lead">Todo envío empieza en la facade <code>Sms</code> y termina con uno de cuatro verbos. Lo que va en medio describe el mensaje.</p>

## El builder {#the-builder}

Al llamar a `Sms::to()`, `Sms::provider()`, `Sms::message()` o `Sms::template()` obtienes un `PendingSms` nuevo. Encadena lo que necesites y termina con un verbo:

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // opcional: por defecto usa SMS_PROVIDER
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // opcional: sustituye al remitente configurado
    ->message('Doors open at 7pm.')
    ->send();
```

| Verbo | Qué hace | Devuelve |
|---|---|---|
| `send()` | Envía ya, o encola si `SMS_QUEUE=true` | `SmsResult`, o `null` si se encoló |
| `sendNow()` | Siempre envía de inmediato | `SmsResult` (o `null` si un listener lo cancela) |
| `sendLater()` | Siempre encola | nada |
| `sendLaterAt($when)` | Encola con un retraso (`later()` es un alias) | nada |

Como cada llamada a la facade crea un builder nuevo, dos envíos nunca comparten destinatarios ni texto, ni siquiera dentro de un worker de Octane que lleva mucho tiempo en marcha.

## Destinatarios {#recipients}

`to()` acepta un solo número, un array o cualquier iterable, incluida una colección:

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

Cada número se limpia y se valida en el momento en que lo añades:

- Se eliminan espacios, guiones, puntos y paréntesis.
- Lo que queda debe tener entre 7 y 15 dígitos, con un `+` opcional al principio. Cualquier otra cosa lanza una `InvalidMessageException` de inmediato, en lugar de fallar más tarde en el proveedor.
- Los duplicados se descartan, así que nadie recibe el mismo mensaje dos veces en un envío.

::: tip Usa E.164
Guarda y envía los números en formato internacional: `+` seguido del código de país y el número. Algunos proveedores rechazan directamente los formatos locales, y otros los envían al país equivocado.
:::

## Texto {#text}

```php
Sms::to($phone)->message('Your table is ready.');
```

El texto se recorta y no puede quedar vacío. Los mensajes pueden tener hasta 1.600 caracteres. Los proveedores dividen todo lo que supere un SMS (160 caracteres GSM, o 70 si lleva emojis u otros caracteres Unicode) en varias partes y cobran cada una, así que los mensajes cortos salen más baratos.

`content()` es un alias de `message()`, por si prefieres el término que usan las notificaciones de Laravel.

## Plantillas {#templates}

Algunos proveedores envían plantillas aprobadas de antemano en lugar de texto libre. En India las exige la normativa DLT, y WhatsApp las exige para las conversaciones que inicia una empresa.

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

Admiten plantillas [MSG91](/es/providers/msg91), [WhatsApp](/es/providers/whatsapp) y [Brevo](/es/providers/brevo). Los demás proveedores necesitan texto: si les envías un mensaje que solo tiene plantilla, se lanza una `InvalidMessageException` que indica el proveedor.

## Remitente {#sender}

Cada proveedor tiene un remitente configurado, por ejemplo un número o un ID alfanumérico como `ACME`. Para cambiarlo en un solo mensaje, usa `from()`:

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

Los remitentes alfanuméricos no se permiten en todas partes. En Estados Unidos y Canadá tienes que enviar desde un número registrado, así que revisa las reglas de tu proveedor para cada país al que envíes.

## Elegir proveedor {#choosing-a-provider}

`provider()` envía este mensaje con un proveedor concreto en lugar del predeterminado:

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

Hay dos nombres especiales: `failover` prueba una cadena de proveedores en orden y `random` elige uno de un grupo. Los dos se explican en [Failover y balanceo de carga](/es/guide/failover).

## Partes condicionales {#conditional-parts}

`PendingSms` admite los métodos `when()` y `unless()` de Laravel:

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## Preparar un mensaje por adelantado {#building-a-message-ahead-of-time}

`SmsMessage` es un objeto simple que puedes construir, pasar de un lado a otro y enviar más tarde:

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## Macros {#macros}

Dale nombre propio a los mensajes que envías una y otra vez:

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Sms::macro('sendOtp', function (string $phone, int $code) {
        return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
    });
}

// En cualquier parte de tu aplicación
Sms::sendOtp($user->phone, 4821);
```
