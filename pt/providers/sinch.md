# Sinch

<p class="lead">Uma plataforma de nível operadora, com conexões diretas com operadoras em muitos países. Envia todos os destinatários em uma única requisição em lote.</p>

| | |
|---|---|
| Chave do driver | `sinch` |
| Cobertura | Global |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [sinch.com](https://sinch.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| Variável | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | Service plan ID do painel de SMS |
| `SINCH_API_TOKEN` | API token desse service plan |
| `SINCH_FROM` | Número remetente ou ID alfanumérico |
| `SINCH_REGION` | `us` (padrão), `eu`, `au`, `br` ou `ca`; precisa ser a região onde sua conta está |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Use a região em que o seu service plan foi criado. Se não bater, a resposta é `401`, mesmo com um token válido.
- O lote inteiro compartilha um único batch ID da Sinch, que você obtém com `$result->firstId()`.
