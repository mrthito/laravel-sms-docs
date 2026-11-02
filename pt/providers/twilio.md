# Twilio

<p class="lead">A API de SMS mais usada do mercado. Ótima entregabilidade na América do Norte e na Europa, com Messaging Services para pools de remetentes e conformidade.</p>

| | |
|---|---|
| Chave do driver | `twilio` |
| Cobertura | Global |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.twilio.com](https://www.twilio.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| Variável | |
|---|---|
| `TWILIO_SID` | Account SID, começa com `AC` |
| `TWILIO_TOKEN` | Auth token |
| `TWILIO_FROM` | Número remetente ou ID alfanumérico |
| `TWILIO_MESSAGING_SERVICE_SID` | Opcional. Usa um Messaging Service em vez de um único remetente (começa com `MG`) |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Você precisa do `TWILIO_FROM` ou do `TWILIO_MESSAGING_SERVICE_SID`. Um Messaging Service deixa a Twilio escolher o melhor número de um pool e cuida dos descadastros (opt-outs) por você.
- Quando uma mensagem define `from()`, esse remetente é usado e o Messaging Service é ignorado naquela mensagem.
- Contas de teste (trial) só podem enviar para números que você verificou no console da Twilio.
