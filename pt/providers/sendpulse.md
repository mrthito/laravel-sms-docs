# SendPulse

<p class="lead">Uma plataforma de marketing multicanal, popular na Europa e na América Latina. Autentica com OAuth 2.0 e envia todos os destinatários em uma única requisição.</p>

| | |
|---|---|
| Chave do driver | `sendpulse` |
| Cobertura | Global |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [sendpulse.com](https://sendpulse.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| Variável | |
|---|---|
| `SENDPULSE_CLIENT_ID` | ID da REST API |
| `SENDPULSE_CLIENT_SECRET` | Secret da REST API |
| `SENDPULSE_SENDER` | Nome de remetente aprovado (até 11 caracteres) |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Os access tokens ficam em cache por cerca de uma hora e são renovados automaticamente.
- Os nomes de remetente precisam ser aprovados no painel da SendPulse antes de serem usados.
