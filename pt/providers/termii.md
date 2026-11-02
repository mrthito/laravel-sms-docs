# Termii

<p class="lead">Uma plataforma nigeriana popular, com rotas compatíveis com DND e envio por WhatsApp na mesma conta.</p>

| | |
|---|---|
| Chave do driver | `termii` |
| Cobertura | Nigéria e África |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Não, só texto |
| Webhooks de entrega | Sim |
| Site | [termii.com](https://termii.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| Variável | |
|---|---|
| `TERMII_API_KEY` | API key |
| `TERMII_SENDER_ID` | Sender ID aprovado |
| `TERMII_CHANNEL` | `generic` (padrão), `dnd` para números em Do-Not-Disturb, ou `whatsapp` |
| `TERMII_BASE_URL` | Opcional. A base URL da sua conta no painel da Termii, só HTTPS |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +2348012345678 --provider=termii
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Use o canal `dnd` para mensagens transacionais, como OTPs. Na Nigéria, a rota `generic` não chega aos números cadastrados no Do-Not-Disturb.
- A Termii autentica com a API key no corpo da requisição; o driver só a envia por HTTPS.

## Relatórios de entrega {#delivery-reports}

Aponte a URL de relatórios de entrega da Termii para `https://your-app.com/laravel-sms/webhook/termii` e ative os [webhooks](/pt/guide/webhooks). As requisições são verificadas com HMAC-SHA512 no `X-Termii-Signature`, usando o `TERMII_WEBHOOK_SECRET`.

Os relatórios verificados disparam o evento `SmsWebhookReceived`.
