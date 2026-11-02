# Sinch

<p class="lead">Una plataforma de nivel operador con conexiones directas a operadores en muchos países. Envía a todos los destinatarios en una sola petición por lotes.</p>

| | |
|---|---|
| Clave del driver | `sinch` |
| Cobertura | Global |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [sinch.com](https://sinch.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| Variable | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | ID del service plan, del panel de SMS |
| `SINCH_API_TOKEN` | API token de ese service plan |
| `SINCH_FROM` | Número remitente o ID alfanumérico |
| `SINCH_REGION` | `us` (predeterminado), `eu`, `au`, `br` o `ca`; debe coincidir con la región de tu cuenta |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Usa la región en la que creaste tu service plan. Si no coincide, recibirás un `401` aunque el token sea válido.
- Todo el lote comparte un mismo batch ID de Sinch, que obtienes con `$result->firstId()`.
