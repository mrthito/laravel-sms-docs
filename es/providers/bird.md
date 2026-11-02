# Bird

<p class="lead">La empresa antes conocida como MessageBird. Este driver usa la API de SMS actual de Bird con API keys de workspace.</p>

| | |
|---|---|
| Clave del driver | `bird` |
| Cobertura | Global |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [bird.com](https://bird.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| Variable | |
|---|---|
| `BIRD_API_KEY` | API key del workspace, empieza por `bk_` |
| `BIRD_FROM` | Número remitente o ID alfanumérico |
| `BIRD_REGION` | `us1` (predeterminado) o `eu1`; debe coincidir con tu key |
| `BIRD_CATEGORY` | `transactional` (predeterminado), `marketing`, `authentication` o `service` |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=bird
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Las keys están ligadas a una región: una key `bk_eu1_…` solo funciona con `BIRD_REGION=eu1`.
- Indica `BIRD_CATEGORY` con honestidad. Varios países aplican reglas distintas, y precios distintos, al tráfico de marketing.
- Las credenciales `AccessKey` del antiguo MessageBird no están soportadas; crea una key de workspace en el panel de Bird.
