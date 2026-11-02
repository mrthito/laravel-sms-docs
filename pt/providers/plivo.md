# Plivo

<p class="lead">Um provedor global com bom custo-benefício e uma REST API simples. Envia todos os destinatários em uma única requisição.</p>

| | |
|---|---|
| Chave do driver | `plivo` |
| Cobertura | Global |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.plivo.com](https://www.plivo.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| Variável | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth token |
| `PLIVO_FROM` | Número remetente ou ID alfanumérico |
| `PLIVO_LOG_MESSAGES` | Opcional, padrão `false`. Define se a Plivo guarda o conteúdo das mensagens e os números nos logs dela |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Aqui, o registro de conteúdo da própria Plivo vem **desligado** por padrão, então o texto das mensagens não fica guardado no painel deles. Só ative se precisar para depurar.
- Cada destinatário recebe o próprio UUID de mensagem da Plivo, na mesma ordem dos seus destinatários.
