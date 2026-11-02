# Twilio

<p class="lead">La API de SMS más usada. Una entregabilidad excelente en Norteamérica y Europa, con Messaging Services para grupos de remitentes y cumplimiento normativo.</p>

| | |
|---|---|
| Clave del driver | `twilio` |
| Cobertura | Global |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.twilio.com](https://www.twilio.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| Variable | |
|---|---|
| `TWILIO_SID` | Account SID, empieza por `AC` |
| `TWILIO_TOKEN` | Auth token |
| `TWILIO_FROM` | Número remitente o ID alfanumérico |
| `TWILIO_MESSAGING_SERVICE_SID` | Opcional. Usa un Messaging Service en lugar de un único remitente (empieza por `MG`) |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Necesitas `TWILIO_FROM` o `TWILIO_MESSAGING_SERVICE_SID`. Un Messaging Service deja que Twilio elija el mejor número de un grupo y gestiona las bajas (opt-outs) por ti.
- Cuando un mensaje define `from()`, se usa ese remitente y el Messaging Service se ignora para ese mensaje.
- Las cuentas de prueba solo pueden enviar SMS a números que hayas verificado en la consola de Twilio.
