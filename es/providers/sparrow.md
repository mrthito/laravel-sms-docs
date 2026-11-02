# Sparrow SMS

<p class="lead">La pasarela de SMS más usada de Nepal, con rutas directas a NTC y Ncell.</p>

| | |
|---|---|
| Clave del driver | `sparrow` |
| Cobertura | Nepal |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [sparrowsms.com](https://sparrowsms.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| Variable | |
|---|---|
| `SPARROW_TOKEN` | API token |
| `SPARROW_FROM` | Tu identidad aprobada (remitente) |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +9779812345678 --provider=sparrow
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+9779812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Todos los destinatarios se envían en una sola petición.
- Escribe los números nepalíes con el código de país (`+97798…`) o como móviles locales de diez dígitos (`98…`); se aceptan los dos formatos.
