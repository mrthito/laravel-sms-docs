# Africa's Talking

<p class="lead">Conexiones directas con operadores en más de 20 países africanos, con un sandbox gratuito para desarrollo.</p>

| | |
|---|---|
| Clave del driver | `africastalking` |
| Cobertura | Toda África |
| Envío | Una sola petición para todos los destinatarios. |
| Plantillas | No, solo texto |
| Webhooks de entrega | Sí |
| Sitio web | [africastalking.com](https://africastalking.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| Variable | |
|---|---|
| `AFRICASTALKING_API_KEY` | API key |
| `AFRICASTALKING_USERNAME` | Nombre de usuario de la app (`sandbox` mientras haces pruebas) |
| `AFRICASTALKING_FROM` | Remitente o short code opcional |
| `AFRICASTALKING_SANDBOX` | `true` para usar la API del sandbox |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- En modo sandbox, los mensajes aparecen en el simulador de Africa's Talking en lugar de en teléfonos reales. Define `AFRICASTALKING_USERNAME=sandbox` y `AFRICASTALKING_SANDBOX=true` a la vez.
- Africa's Talking informa del estado de cada destinatario. Los números rechazados, por ejemplo por saldo insuficiente, aparecen en la `DeliveryException`.

## Informes de entrega {#delivery-reports}

Apunta la URL de informes de entrega de Africa's Talking a `https://your-app.com/laravel-sms/webhook/africastalking` y activa los [webhooks](/es/guide/webhooks). Las peticiones se verifican con un secreto `?token=` en la URL de callback, usando `AFRICASTALKING_WEBHOOK_SECRET` (Africa's Talking no firma sus callbacks).

Los informes verificados disparan el evento `SmsWebhookReceived`.
