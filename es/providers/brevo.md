# Brevo

<p class="lead">Antes llamado Sendinblue. Encaja bien si ya envías correos con Brevo y quieres una sola cuenta para ambas cosas.</p>

| | |
|---|---|
| Clave del driver | `brevo` |
| Cobertura | Global |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | Sí |
| Webhooks de entrega | No |
| Sitio web | [www.brevo.com](https://www.brevo.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| Variable | |
|---|---|
| `BREVO_API_KEY` | API key (v3) |
| `BREVO_SMS_SENDER` | Nombre del remitente (hasta 11 caracteres) o número |
| `BREVO_SMS_TYPE` | `transactional` (predeterminado) o `marketing` |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Se admiten las plantillas de SMS de Brevo: pasa el ID de la plantilla y sus parámetros con `->template('12', ['code' => 4821])`.
- Los mensajes de marketing deben incluir una forma de darse de baja y, en algunos países, están sujetos a horarios restringidos. Usa `transactional` para códigos y recibos.
