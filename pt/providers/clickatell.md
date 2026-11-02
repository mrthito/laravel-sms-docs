# Clickatell

<p class="lead">Um gateway veterano, com cobertura ampla na África e em mercados emergentes. Usa a One API da Clickatell.</p>

| | |
|---|---|
| Chave do driver | `clickatell` |
| Cobertura | Global |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.clickatell.com](https://www.clickatell.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| Variável | |
|---|---|
| `CLICKATELL_API_KEY` | API key de uma integração One API |
| `CLICKATELL_FROM` | Remetente opcional, se a sua conta tiver um aprovado |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- A Clickatell aceita até 100 destinatários por requisição; envios maiores são divididos em lotes automaticamente.
- Cada destinatário é aceito ou recusado individualmente, e as recusas são informadas número a número.
