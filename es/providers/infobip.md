# Infobip

<p class="lead">Una plataforma empresarial con un alcance muy amplio entre operadores, especialmente fuerte en Europa, Oriente Medio y África. Usa la SMS API v3.</p>

| | |
|---|---|
| Clave del driver | `infobip` |
| Cobertura | Global |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.infobip.com](https://www.infobip.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| Variable | |
|---|---|
| `INFOBIP_API_KEY` | API key |
| `INFOBIP_SENDER` | Número remitente o ID alfanumérico |
| `INFOBIP_BASE_URL` | Tu URL base personal del portal de Infobip, por ejemplo `https://xyz123.api.infobip.com` |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Usa la **URL base personal** que aparece en la página principal de tu cuenta de Infobip. Infobip enruta tu tráfico a través de ella, y el soporte te la pedirá.
- La URL base debe usar HTTPS; cualquier otra cosa se rechaza al cargar el driver.
