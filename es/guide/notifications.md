# Notificaciones

<p class="lead">Si tu aplicación ya envía correos con las notificaciones de Laravel, el SMS es solo un canal más. El paquete lo registra como <code>sms</code>.</p>

## Escribir una notificación {#writing-a-notification}

Añade `sms` a `via()` y devuelve el mensaje desde `toSms()`:

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

Si no necesitas nada más, `toSms()` también puede devolver un string sin más:

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

Para encolar las notificaciones SMS, implementa `ShouldQueue` en la notificación, igual que con cualquier notificación de Laravel. Laravel crea un job por cada notifiable y canal, así que el SMS y el correo se reintentan por separado.

Manda los jobs de SMS a su propia cola con `viaQueues()`:

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

En Laravel 13, los límites de reintentos se pueden declarar con atributos:

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

Si la notificación se envía dentro de una transacción de base de datos, encadena `afterCommit()` para que el SMS nunca salga por un pedido cuya transacción se revirtió:

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

## Enrutar a un número de teléfono {#routing-to-a-phone-number}

El canal le pregunta al notifiable a dónde enviar. Añade `routeNotificationForSms()` a tu modelo:

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

Si devuelve `null` o un string vacío, el SMS se omite sin hacer ruido. Viene bien para los usuarios que todavía no han añadido un número.

Si el mensaje ya tiene destinatarios, se envía a ellos y no se usa el enrutamiento.

### Notificaciones bajo demanda {#on-demand-notifications}

Para notificar a alguien que no es usuario de tu base de datos:

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## La notificación ya hecha {#the-ready-made-notification}

Para mensajes puntuales, `SmsNotification` te ahorra escribir una clase:

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## El trait HasSms {#the-hassms-trait}

Para enviar rápido directamente desde un modelo, añade `HasSms`:

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

Los dos envían de inmediato y devuelven el `SmsResult`. Con el trait, deja el parámetro `$notification` como opcional, como en el ejemplo, para que el mismo método sirva tanto para las notificaciones como para los helpers.
