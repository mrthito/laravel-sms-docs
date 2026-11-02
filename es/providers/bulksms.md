# BulkSMS

<p class="lead">Una pasarela global sin complicaciones que envía a todos los destinatarios en una sola petición JSON.</p>

| | |
|---|---|
| Clave del driver | `bulksms` |
| Cobertura | Global, con más fuerza en el sur de África |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | Sí |
| Sitio web | [www.bulksms.com](https://www.bulksms.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| Variable | |
|---|---|
| `BULKSMS_TOKEN_ID` | ID del API token |
| `BULKSMS_TOKEN_SECRET` | Secret del API token |
| `BULKSMS_FROM` | Remitente opcional, si tu cuenta tiene uno |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Crea un token en *Settings → API Tokens*; el driver lo usa con autenticación HTTP Basic.

## Informes de entrega {#delivery-reports}

Apunta la URL de informes de entrega de BulkSMS a `https://your-app.com/laravel-sms/webhook/bulksms` y activa los [webhooks](/es/guide/webhooks). Las peticiones se verifican con un HMAC-SHA256 en `X-BulkSMS-Signature`, usando `BULKSMS_WEBHOOK_SECRET`.

Los informes verificados disparan el evento `SmsWebhookReceived`.
