# Sendchamp

<p class="lead">Uma plataforma de comunicação nigeriana com rotas DND, não DND e internacionais. Envia todos os destinatários em uma única requisição.</p>

| | |
|---|---|
| Chave do driver | `sendchamp` |
| Cobertura | Nigéria e África |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Sim |
| Site | [sendchamp.com](https://sendchamp.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| Variável | |
|---|---|
| `SENDCHAMP_API_KEY` | Public access key |
| `SENDCHAMP_SENDER_NAME` | Nome de remetente aprovado |
| `SENDCHAMP_ROUTE` | `dnd` (padrão), `non_dnd` ou `international` |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Use a rota `dnd` para tudo o que não pode atrasar, como códigos de login; ela chega aos números cadastrados no Do-Not-Disturb.

## Relatórios de entrega {#delivery-reports}

Aponte a URL de relatórios de entrega da Sendchamp para `https://your-app.com/laravel-sms/webhook/sendchamp` e ative os [webhooks](/pt/guide/webhooks). As requisições são verificadas com HMAC-SHA256 no `X-Sendchamp-Signature`, usando o `SENDCHAMP_WEBHOOK_SECRET`.

Os relatórios verificados disparam o evento `SmsWebhookReceived`.
