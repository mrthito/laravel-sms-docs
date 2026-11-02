# BulkSMS

<p class="lead">Um gateway global sem complicação, que envia todos os destinatários em uma única requisição JSON.</p>

| | |
|---|---|
| Chave do driver | `bulksms` |
| Cobertura | Global, mais forte no sul da África |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Sim |
| Site | [www.bulksms.com](https://www.bulksms.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| Variável | |
|---|---|
| `BULKSMS_TOKEN_ID` | ID do API token |
| `BULKSMS_TOKEN_SECRET` | Secret do API token |
| `BULKSMS_FROM` | Remetente opcional, se a sua conta tiver um |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Crie um token em *Settings → API Tokens*; o driver o usa com autenticação HTTP Basic.

## Relatórios de entrega {#delivery-reports}

Aponte a URL de relatórios de entrega da BulkSMS para `https://your-app.com/laravel-sms/webhook/bulksms` e ative os [webhooks](/pt/guide/webhooks). As requisições são verificadas com HMAC-SHA256 no `X-BulkSMS-Signature`, usando o `BULKSMS_WEBHOOK_SECRET`.

Os relatórios verificados disparam o evento `SmsWebhookReceived`.
