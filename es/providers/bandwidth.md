# Bandwidth

<p class="lead">Un operador estadounidense con red propia, que usan muchas de las grandes plataformas de comunicación. Se autentica con OAuth 2.0.</p>

| | |
|---|---|
| Clave del driver | `bandwidth` |
| Cobertura | Estados Unidos y Canadá |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [www.bandwidth.com](https://www.bandwidth.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| Variable | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | Account ID |
| `BANDWIDTH_APPLICATION_ID` | Aplicación de mensajería vinculada a tu número |
| `BANDWIDTH_CLIENT_ID` | Client ID de OAuth |
| `BANDWIDTH_CLIENT_SECRET` | Client secret de OAuth |
| `BANDWIDTH_FROM` | Un número de Bandwidth asignado a esa aplicación |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- El driver intercambia tu client ID y tu secret por un token de acceso y lo guarda en caché durante aproximadamente una hora. Si el token se rechaza antes de tiempo, se descarta y el siguiente envío obtiene uno nuevo.
- Los destinatarios se envían uno a uno a propósito: Bandwidth trata varios números en una misma petición como una conversación de grupo, en la que todos ven las respuestas de los demás.
