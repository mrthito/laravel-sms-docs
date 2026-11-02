# SendPulse

<p class="lead">Una plataforma de marketing multicanal, popular en Europa y Latinoamérica. Se autentica con OAuth 2.0 y envía a todos los destinatarios en una sola petición.</p>

| | |
|---|---|
| Clave del driver | `sendpulse` |
| Cobertura | Global |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [sendpulse.com](https://sendpulse.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| Variable | |
|---|---|
| `SENDPULSE_CLIENT_ID` | ID de la REST API |
| `SENDPULSE_CLIENT_SECRET` | Secret de la REST API |
| `SENDPULSE_SENDER` | Nombre de remitente aprobado (hasta 11 caracteres) |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Los tokens de acceso se guardan en caché durante aproximadamente una hora y se renuevan automáticamente.
- Los nombres de remitente tienen que aprobarse en el panel de SendPulse antes de poder usarlos.
