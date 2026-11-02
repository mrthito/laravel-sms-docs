# ClickSend

<p class="lead">Popular na Austrália, no Reino Unido e nos EUA, com um painel bem organizado e o status de cada mensagem em todas as respostas.</p>

| | |
|---|---|
| Chave do driver | `clicksend` |
| Cobertura | Global |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.clicksend.com](https://www.clicksend.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| Variável | |
|---|---|
| `CLICKSEND_USERNAME` | Seu usuário da ClickSend |
| `CLICKSEND_API_KEY` | API key do painel |
| `CLICKSEND_FROM` | Remetente opcional. Deixe vazio para usar os números compartilhados da ClickSend |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- A ClickSend informa cada destinatário separadamente. Se alguns forem recusados, você recebe uma `DeliveryException` que lista exatamente esses números, e um resultado `partial` com os demais.
