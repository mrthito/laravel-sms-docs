# Telnyx

<p class="lead">Un operador pensado para desarrolladores, con su propia red privada y precios competitivos en Estados Unidos.</p>

| | |
|---|---|
| Clave del driver | `telnyx` |
| Cobertura | Global |
| Envío | Una petición por destinatario, enviadas [en paralelo](/es/guide/performance). |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [telnyx.com](https://telnyx.com) |

## Configuración {#configure}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| Variable | |
|---|---|
| `TELNYX_API_KEY` | API key (v2) |
| `TELNYX_FROM` | Número remitente |
| `TELNYX_MESSAGING_PROFILE_ID` | Opcional. Usa un messaging profile y su grupo de números en lugar de un único remitente |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- Necesitas `TELNYX_FROM` o `TELNYX_MESSAGING_PROFILE_ID`.
- Los números de Estados Unidos tienen que estar registrados en 10DLC antes de que Telnyx entregue tráfico de aplicación a persona (A2P).
