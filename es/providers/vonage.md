# Vonage

<p class="lead">Antes llamado Nexmo. Buena cobertura internacional y precios sencillos, a través de la Vonage SMS API.</p>

| | |
|---|---|
| Clave del driver | `vonage` |
| Cobertura | Global |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.vonage.com](https://www.vonage.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| Variable | |
|---|---|
| `VONAGE_KEY` | API key |
| `VONAGE_SECRET` | API secret |
| `VONAGE_FROM` | Número remitente o ID alfanumérico |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Los mensajes con caracteres fuera del alfabeto GSM, como emojis o devanagari, se envían automáticamente como Unicode, así que llegan intactos.
- Vonage responde con HTTP 200 incluso cuando rechaza un mensaje. El driver lee el estado de cada mensaje, así que los rechazos siguen lanzando una `DeliveryException` con el motivo que da Vonage.
