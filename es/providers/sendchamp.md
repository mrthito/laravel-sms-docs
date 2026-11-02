# Sendchamp

<p class="lead">Una plataforma nigeriana de comunicaciones con rutas DND, no DND e internacionales. Envía a todos los destinatarios en una sola petición.</p>

| | |
|---|---|
| Clave del driver | `sendchamp` |
| Cobertura | Nigeria y África |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | Sí |
| Sitio web | [sendchamp.com](https://sendchamp.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| Variable | |
|---|---|
| `SENDCHAMP_API_KEY` | Public access key |
| `SENDCHAMP_SENDER_NAME` | Nombre de remitente aprobado |
| `SENDCHAMP_ROUTE` | `dnd` (predeterminado), `non_dnd` o `international` |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Reserva la ruta `dnd` para todo lo que sea urgente, como los códigos de inicio de sesión; llega a los números inscritos en Do-Not-Disturb.

## Informes de entrega {#delivery-reports}

Apunta la URL de informes de entrega de Sendchamp a `https://your-app.com/laravel-sms/webhook/sendchamp` y activa los [webhooks](/es/guide/webhooks). Las peticiones se verifican con un HMAC-SHA256 en `X-Sendchamp-Signature`, usando `SENDCHAMP_WEBHOOK_SECRET`.

Los informes verificados disparan el evento `SmsWebhookReceived`.
