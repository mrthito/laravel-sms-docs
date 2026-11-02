# MSG91

<p class="lead">Una de las principales pasarelas de India. Los mensajes con plantilla usan los Flows de MSG91, que se encargan del registro DLT por ti.</p>

| | |
|---|---|
| Clave del driver | `msg91` |
| Cobertura | India |
| Envío | Plantillas: una sola petición para todos los destinatarios. Texto libre: una petición por destinatario, en paralelo. |
| Plantillas | Sí |
| Webhooks de entrega | No |
| Sitio web | [msg91.com](https://msg91.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| Variable | |
|---|---|
| `MSG91_AUTHKEY` | Auth key |
| `MSG91_SENDER` | Remitente de seis caracteres registrado en DLT |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +919812345678 --provider=msg91
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- La normativa india (DLT) exige que cada mensaje comercial coincida con una plantilla registrada. Crea un Flow en MSG91 y envíalo con `->template($flowId, ['otp' => 4821])`. Todos los destinatarios van en una sola petición y todos reciben las mismas variables.
- Los mensajes de texto libre usan la API v2 de MSG91, con un destinatario por petición, y solo llegan a números indios si el texto coincide exactamente con una plantilla DLT.
