# Termii

<p class="lead">Una plataforma nigeriana muy popular, con rutas que cumplen las normas DND y envío por WhatsApp desde la misma cuenta.</p>

| | |
|---|---|
| Clave del driver | `termii` |
| Cobertura | Nigeria y África |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | No, solo texto |
| Webhooks de entrega | Sí |
| Sitio web | [termii.com](https://termii.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| Variable | |
|---|---|
| `TERMII_API_KEY` | API key |
| `TERMII_SENDER_ID` | Remitente aprobado |
| `TERMII_CHANNEL` | `generic` (predeterminado), `dnd` para números inscritos en Do-Not-Disturb, o `whatsapp` |
| `TERMII_BASE_URL` | Opcional. La URL base de tu cuenta, del panel de Termii; solo HTTPS |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +2348012345678 --provider=termii
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Usa el canal `dnd` para mensajes transaccionales como los OTP. En Nigeria, la ruta `generic` no llega a los números inscritos en Do-Not-Disturb.
- Termii se autentica con la API key en el cuerpo de la petición; el driver solo la envía por HTTPS.

## Informes de entrega {#delivery-reports}

Apunta la URL de informes de entrega de Termii a `https://your-app.com/laravel-sms/webhook/termii` y activa los [webhooks](/es/guide/webhooks). Las peticiones se verifican con un HMAC-SHA512 en `X-Termii-Signature`, usando `TERMII_WEBHOOK_SECRET`.

Los informes verificados disparan el evento `SmsWebhookReceived`.
