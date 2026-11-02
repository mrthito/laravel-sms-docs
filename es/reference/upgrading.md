# Actualizar desde 1.x

<p class="lead">La versión 2 reconstruye el núcleo en torno a resultados en lugar de booleanos. A la mayoría de las aplicaciones les bastan los tres primeros pasos, y llevan una media hora.</p>

## 1. Actualiza el paquete {#_1-update-the-package}

```bash
composer require mr-rijal/laravel-sms:^2.0
```

Si usas el driver de **AWS SNS**, el SDK de AWS ya no se instala automáticamente:

```bash
composer require aws/aws-sdk-php
```

## 2. Vuelve a publicar la configuración o fusiónala {#_2-re-publish-or-merge-the-config}

```bash
php artisan vendor:publish --tag=sms-config --force
```

Si tienes un `config/sms.php` personalizado, incorpora estos cambios a mano:

- `default` ahora usa `log` como valor de reserva en lugar de `fake`.
- Secciones nuevas: `retry`, `http` y `providers.failover`.
- Proveedores nuevos: `sinch`, `bird`, `clicksend`, `clickatell`, `brevo`, `bandwidth`, `sendpulse`.
- Proveedores eliminados: `telegram_mirror`, `discord_webhook`, `slack_webhook`.

## 3. Resultados en lugar de booleanos {#_3-send-results-instead-of-booleans}

`send()`, `sendNow()` y los helpers de `HasSms` ahora devuelven `?SmsResult` en lugar de `bool`.

```php
// 1.x
if (Sms::to($n)->message('Hi')->sendNow()) { ... }

// 2.0
$result = Sms::to($n)->message('Hi')->sendNow();
$result?->firstId();
```

Un resultado es `null` cuando un listener de `SmsSending` cancela el envío o cuando `send()` encola el mensaje. Los fallos siguen lanzando excepciones, como en la 1.x.

## Drivers eliminados {#removed-drivers}

Se eliminaron los drivers espejo de Telegram, Discord y Slack: nunca entregaban un SMS. Si los usabas para alertas internas, escucha el evento `SmsSent` y publica en tu canal con una notificación de Laravel.

## Excepciones {#exceptions}

Los fallos del proveedor lanzan `MrRijal\LaravelSms\Exceptions\DeliveryException` (sigue siendo una `RuntimeException`). Los datos de entrada no válidos lanzan `InvalidMessageException` y una configuración incorrecta lanza `InvalidConfigurationException` (las dos siguen siendo `InvalidArgumentException`). Captura `MrRijal\LaravelSms\Exceptions\SmsException` para manejarlas todas.

`DeliveryException::$failedRecipients` y `DeliveryException::$partial` te dicen quién recibió el mensaje y quién no.

## Eventos {#events}

- `SmsSent` ya no tiene las propiedades `success` y `error`. Solo se dispara cuando el envío tiene éxito y lleva `result` (un `SmsResult`).
- Los fallos disparan el nuevo evento `SmsFailed` con la `exception`.
- Los listeners de `SmsSending` ahora pueden devolver `false` para cancelar el envío.

## Notificaciones {#notifications}

`toSms()` ahora debe **devolver** un `SmsMessage` (o un string) en lugar de enviar el mensaje por su cuenta. El canal lo enruta con `routeNotificationForSms()` y admite `Notification::route('sms', $number)`.

```php
// 1.x
public function toSms($notifiable): void
{
    Sms::to($notifiable->phone)->message('Shipped')->sendNow();
}

// 2.0
public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create('Shipped');
}
```

`SmsNotification` ya no lee `sms.queue`. Para encolar notificaciones, implementa `ShouldQueue` en tu notificación, como con cualquier notificación de Laravel.

## Facade y manager {#facade-and-manager}

- `Sms::to()`, `Sms::provider()`, `Sms::message()` y `Sms::template()` ahora devuelven un `PendingSms` nuevo cada vez, así que los envíos no comparten estado.
- `Sms::sendMessage($message, $provider)` se sustituyó por `Sms::sendNow($message->provider($provider))`.
- `SmsManager` se construye con el contenedor. Resuélvelo desde el contenedor (`app(SmsManager::class)`) en lugar de hacer `new SmsManager`.

## Drivers propios {#custom-drivers}

`SmsProvider::send()` ahora debe devolver un `SmsResult`:

```php
public function send(SmsMessage $message): SmsResult
{
    // ... llama al proveedor ...

    return SmsResult::accepted($message->getTo(), $providerMessageId);
}
```

Extiende `MrRijal\LaravelSms\Drivers\HttpDriver` y obtendrás gratis la validación de la configuración, los timeouts, los envíos en paralelo, la gestión de fallos parciales y mensajes de error seguros. Los drivers ahora usan el cliente HTTP de Laravel, así que los constructores ya no aceptan un `Client` de Guzzle; usa `Http::fake()` en las pruebas.

## Pruebas {#testing}

Sustituye las aserciones sobre `FakeDriver::$messages` por `Sms::fake()`:

```php
Sms::fake();
// ...
Sms::assertSentTo('+15551234567');
```

`FakeDriver` sigue existiendo para las aplicaciones que dependen de él.
