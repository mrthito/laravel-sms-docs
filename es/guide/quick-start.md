# Tu primer mensaje

<p class="lead">Un recorrido por las cinco cosas que más vas a hacer: enviar, revisar el resultado, encolar, notificar y probar.</p>

## Envía un mensaje {#send-a-message}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

Los números pueden llevar espacios, guiones, puntos y paréntesis: `+1 (555) 123-4567` y `+15551234567` son el mismo destinatario. Siempre que puedas, usa el formato internacional con el `+` delante. La mayoría de los proveedores lo necesitan para enrutar el mensaje.

## Revisa qué pasó {#check-what-happened}

`sendNow()` envía de inmediato y devuelve un `SmsResult`:

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // el ID del mensaje en el proveedor; conviene guardarlo
```

Si el proveedor rechaza el mensaje, una `DeliveryException` te explica el motivo:

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

En [Resultados y errores](/es/guide/results) verás los fallos parciales y qué contiene cada propiedad.

## Mándalo a la cola {#queue-it}

Enviar implica un viaje de ida y vuelta por la red. Dentro de una petición web, encola el mensaje para que tus usuarios no tengan que esperar:

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## Envíalo como notificación {#send-it-as-a-notification}

Si ya usas las notificaciones de Laravel, añade el canal `sms`:

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

El canal le pide el número a tu modelo mediante `routeNotificationForSms()`. Tienes todos los detalles en [Notificaciones](/es/guide/notifications).

## Pruébalo {#test-it}

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

Esto es lo esencial del paquete. El resto de la guía profundiza en cada parte, empezando por [cómo redactar mensajes](/es/guide/sending).
