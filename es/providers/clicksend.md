# ClickSend

<p class="lead">Popular en Australia, Reino Unido y Estados Unidos, con un panel claro y el estado de cada mensaje en todas las respuestas.</p>

| | |
|---|---|
| Clave del driver | `clicksend` |
| Cobertura | Global |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.clicksend.com](https://www.clicksend.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| Variable | |
|---|---|
| `CLICKSEND_USERNAME` | Tu nombre de usuario de ClickSend |
| `CLICKSEND_API_KEY` | API key del panel |
| `CLICKSEND_FROM` | Remitente opcional. Déjalo vacío para usar los números compartidos de ClickSend |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- ClickSend informa de cada destinatario por separado. Si algunos se rechazan, recibes una `DeliveryException` con exactamente esos números y un resultado `partial` con el resto.
