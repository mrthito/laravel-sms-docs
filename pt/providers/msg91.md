# MSG91

<p class="lead">Um dos principais gateways da Índia. As mensagens com template usam os Flows do MSG91, que cuidam do registro na DLT para você.</p>

| | |
|---|---|
| Chave do driver | `msg91` |
| Cobertura | Índia |
| Envio | Templates: uma única requisição para todos os destinatários. Texto simples: uma requisição por destinatário, em paralelo. |
| Templates | Sim |
| Webhooks de entrega | Não |
| Site | [msg91.com](https://msg91.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| Variável | |
|---|---|
| `MSG91_AUTHKEY` | Auth key |
| `MSG91_SENDER` | Sender ID de seis caracteres registrado na DLT |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +919812345678 --provider=msg91
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- As regras indianas (DLT) exigem que toda mensagem comercial siga um template registrado. Crie um Flow no MSG91 e envie com `->template($flowId, ['otp' => 4821])`. Todos os destinatários vão em uma única requisição, e cada um recebe as mesmas variáveis.
- Mensagens de texto simples usam a API v2 do MSG91, um destinatário por requisição, e só chegam a números indianos se o texto bater exatamente com um template da DLT.
