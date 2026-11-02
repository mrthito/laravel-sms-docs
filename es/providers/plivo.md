# Plivo

<p class="lead">Un proveedor global económico con una API REST sencilla. Envía a todos los destinatarios en una sola petición.</p>

| | |
|---|---|
| Clave del driver | `plivo` |
| Cobertura | Global |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.plivo.com](https://www.plivo.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| Variable | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth token |
| `PLIVO_FROM` | Número remitente o ID alfanumérico |
| `PLIVO_LOG_MESSAGES` | Opcional, `false` por defecto. Indica si Plivo guarda en sus logs el contenido de los mensajes y los números |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Aquí el registro de contenido propio de Plivo está **desactivado** por defecto, así que el texto de los mensajes no se conserva en su panel. Actívalo solo si lo necesitas para depurar.
- Cada destinatario recibe su propio UUID de mensaje de Plivo, en el mismo orden que tus destinatarios.
