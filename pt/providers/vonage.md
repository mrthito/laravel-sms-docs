# Vonage

<p class="lead">A antiga Nexmo. Boa cobertura internacional e preços simples, usando a SMS API da Vonage.</p>

| | |
|---|---|
| Chave do driver | `vonage` |
| Cobertura | Global |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.vonage.com](https://www.vonage.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| Variável | |
|---|---|
| `VONAGE_KEY` | API key |
| `VONAGE_SECRET` | API secret |
| `VONAGE_FROM` | Número remetente ou ID alfanumérico |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Mensagens com caracteres fora do alfabeto GSM, como emoji ou devanágari, são enviadas como Unicode automaticamente, então chegam intactas.
- A Vonage responde com HTTP 200 mesmo quando recusa uma mensagem. O driver lê o status de cada mensagem, então as recusas continuam gerando uma `DeliveryException` com o motivo informado pela Vonage.
