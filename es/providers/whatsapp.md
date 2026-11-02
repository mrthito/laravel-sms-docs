# WhatsApp

<p class="lead">Envía mensajes de WhatsApp a través de la Cloud API de Meta con la misma API que usas para los SMS. Admite texto libre y plantillas aprobadas.</p>

| | |
|---|---|
| Clave del driver | `whatsapp` |
| Cobertura | Global |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | Sí |
| Webhooks de entrega | Sí |
| Sitio web | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| Variable | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID del WhatsApp Manager |
| `WHATSAPP_ACCESS_TOKEN` | Un token de acceso permanente de usuario del sistema |
| `WHATSAPP_API_VERSION` | Opcional, `v21.0` por defecto |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Opcional, `en` por defecto. Código de idioma de tus plantillas, por ejemplo `en_US` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | Opcional. Se añade a los números escritos sin código de país |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- WhatsApp solo permite texto libre durante las 24 horas siguientes al último mensaje del cliente. Para iniciar una conversación, envía una plantilla aprobada: `->template('order_update', ['Ana', '#4821'])`. Las variables rellenan en orden los parámetros del cuerpo de la plantilla.
- Usa un token de usuario del sistema, no el token temporal de la página de primeros pasos, que caduca al cabo de un día.

## Informes de entrega {#delivery-reports}

Apunta la URL de informes de entrega de WhatsApp a `https://your-app.com/laravel-sms/webhook/whatsapp` y activa los [webhooks](/es/guide/webhooks). Las peticiones se verifican con un HMAC `X-Hub-Signature-256` (`WHATSAPP_WEBHOOK_SECRET`), y la verificación de suscripción de Meta usa `WHATSAPP_VERIFY_TOKEN`.

Los informes verificados disparan el evento `SmsWebhookReceived`.
