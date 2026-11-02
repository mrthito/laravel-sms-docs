# WhatsApp

<p class="lead">Envie mensagens de WhatsApp pela Cloud API da Meta com a mesma API que você usa para SMS. Aceita texto livre e templates aprovados.</p>

| | |
|---|---|
| Chave do driver | `whatsapp` |
| Cobertura | Global |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Sim |
| Webhooks de entrega | Sim |
| Site | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| Variável | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID do WhatsApp Manager |
| `WHATSAPP_ACCESS_TOKEN` | Um access token permanente de system user |
| `WHATSAPP_API_VERSION` | Opcional, padrão `v21.0` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Opcional, padrão `en`. Código de idioma dos seus templates, como `en_US` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | Opcional. Adicionado aos números escritos sem código do país |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- O WhatsApp só permite texto livre nas 24 horas seguintes à última mensagem do cliente. Para iniciar uma conversa, envie um template aprovado: `->template('order_update', ['Ana', '#4821'])`. As variáveis preenchem os parâmetros do corpo do template em ordem.
- Use um token de system user, e não o token temporário da página de primeiros passos, que expira em um dia.

## Relatórios de entrega {#delivery-reports}

Aponte a URL de relatórios de entrega do WhatsApp para `https://your-app.com/laravel-sms/webhook/whatsapp` e ative os [webhooks](/pt/guide/webhooks). As requisições são verificadas com um HMAC `X-Hub-Signature-256` (`WHATSAPP_WEBHOOK_SECRET`), e a verificação de assinatura da Meta usa o `WHATSAPP_VERIFY_TOKEN`.

Os relatórios verificados disparam o evento `SmsWebhookReceived`.
