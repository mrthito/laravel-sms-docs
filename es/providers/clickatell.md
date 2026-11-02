# Clickatell

<p class="lead">Una pasarela veterana con amplia cobertura en África y en mercados emergentes. Usa la Clickatell One API.</p>

| | |
|---|---|
| Clave del driver | `clickatell` |
| Cobertura | Global |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.clickatell.com](https://www.clickatell.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| Variable | |
|---|---|
| `CLICKATELL_API_KEY` | API key de una integración One API |
| `CLICKATELL_FROM` | Remitente opcional, si tu cuenta tiene uno aprobado |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Clickatell acepta hasta 100 destinatarios por petición; los envíos más grandes se dividen automáticamente en lotes.
- Cada destinatario se acepta o se rechaza de forma individual, y los rechazos se informan número por número.
