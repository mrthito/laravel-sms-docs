# Configuración

<p class="lead">Todo lo que hay en <code>config/sms.php</code> y la variable de entorno que lo define. Publica el archivo con <code>php artisan vendor:publish --tag=sms-config</code>; rara vez tendrás que editarlo.</p>

## Envío {#sending}

| Opción | Variable de entorno | Valor predeterminado | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | Proveedor que se usa cuando un mensaje no indica ninguno. También acepta `failover` y `random`. |
| `random_drivers` | — | `['twilio', 'msg91']` | El grupo del que elige `random`. |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | Cadena de `failover` separada por comas, que se prueba en orden. |

## Colas {#queueing}

| Opción | Variable de entorno | Valor predeterminado | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | Si es `true`, `send()` encola en lugar de enviar de inmediato. |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | la tuya por defecto | Conexión de cola para los jobs de SMS. |
| `queue_name` | `SMS_QUEUE_NAME` | la tuya por defecto | Nombre de la cola para los jobs de SMS. |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | Intentos por destinatario antes de que un job falle. |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | Segundos que puede durar un job. El `retry_after` de tu cola debe ser mayor. |
| `retry.backoff` | — | `[10, 30, 60]` | Segundos de espera antes de cada reintento. |

## HTTP {#http}

| Opción | Variable de entorno | Valor predeterminado | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | Segundos de espera para la respuesta de un proveedor. |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | Segundos de espera para establecer la conexión. |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | Peticiones en paralelo para los proveedores de un destinatario por petición. |

## Webhooks {#webhooks}

| Opción | Variable de entorno | Valor predeterminado | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | Registra la ruta de los webhooks. |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | Prefijo de la URL; se le añade la clave del proveedor. |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | Middleware que se aplica a la ruta. |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | Secreto de la app de Meta. |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | Token para la verificación de suscripción de Meta. |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | Se pasa como `?token=` en la URL de callback. |

## Drivers y proveedores {#drivers-and-providers}

Dos mapas conectan la clave de un proveedor con su código y sus credenciales:

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

`drivers` decide qué clase atiende cada clave, y `providers` guarda los ajustes de esa clave, que se le pasan a la clase. La [página de cada proveedor](/es/providers/) enumera sus ajustes.

Para usar el mismo proveedor con dos cuentas, por ejemplo una transaccional y otra de marketing, registra la clase dos veces con claves distintas:

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## Caché de configuración {#config-caching}

La configuración no contiene closures, así que `php artisan config:cache` funciona como siempre. Vuelve a ejecutarlo cada vez que cambies el `.env` en producción.
