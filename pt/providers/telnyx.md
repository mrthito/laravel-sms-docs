# Telnyx

<p class="lead">Uma operadora voltada para desenvolvedores, com rede privada própria e preços competitivos nos EUA.</p>

| | |
|---|---|
| Chave do driver | `telnyx` |
| Cobertura | Global |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [telnyx.com](https://telnyx.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| Variável | |
|---|---|
| `TELNYX_API_KEY` | API key (v2) |
| `TELNYX_FROM` | Número remetente |
| `TELNYX_MESSAGING_PROFILE_ID` | Opcional. Usa um messaging profile e o pool de números dele em vez de um único remetente |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Você precisa do `TELNYX_FROM` ou do `TELNYX_MESSAGING_PROFILE_ID`.
- Números dos EUA precisam ser registrados no 10DLC antes que a Telnyx entregue tráfego de aplicação para pessoa (A2P).
