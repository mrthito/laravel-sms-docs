# Bird

<p class="lead">A empresa antes conhecida como MessageBird. Este driver usa a SMS API atual da Bird, com API keys de workspace.</p>

| | |
|---|---|
| Chave do driver | `bird` |
| Cobertura | Global |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [bird.com](https://bird.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| Variável | |
|---|---|
| `BIRD_API_KEY` | API key do workspace, começa com `bk_` |
| `BIRD_FROM` | Número remetente ou ID alfanumérico |
| `BIRD_REGION` | `us1` (padrão) ou `eu1`; precisa bater com a sua chave |
| `BIRD_CATEGORY` | `transactional` (padrão), `marketing`, `authentication` ou `service` |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=bird
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- As chaves são vinculadas a uma região: uma chave `bk_eu1_…` só funciona com `BIRD_REGION=eu1`.
- Defina o `BIRD_CATEGORY` com honestidade. Vários países aplicam regras diferentes, e preços diferentes, ao tráfego de marketing.
- Credenciais `AccessKey` antigas da MessageBird não são suportadas; crie uma chave de workspace no painel da Bird.
