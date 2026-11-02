# Africa's Talking

<p class="lead">Conexões diretas com operadoras em mais de 20 países africanos, com um sandbox gratuito para desenvolvimento.</p>

| | |
|---|---|
| Chave do driver | `africastalking` |
| Cobertura | África inteira |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Sim |
| Site | [africastalking.com](https://africastalking.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| Variável | |
|---|---|
| `AFRICASTALKING_API_KEY` | API key |
| `AFRICASTALKING_USERNAME` | Username do app (`sandbox` durante os testes) |
| `AFRICASTALKING_FROM` | Sender ID ou short code opcional |
| `AFRICASTALKING_SANDBOX` | `true` para usar a API de sandbox |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- No modo sandbox, as mensagens aparecem no simulador da Africa's Talking em vez de chegarem a celulares de verdade. Defina `AFRICASTALKING_USERNAME=sandbox` e `AFRICASTALKING_SANDBOX=true` juntos.
- A Africa's Talking informa o status de cada destinatário. Números recusados, por exemplo por saldo insuficiente, aparecem listados na `DeliveryException`.

## Relatórios de entrega {#delivery-reports}

Aponte a URL de relatórios de entrega da Africa's Talking para `https://your-app.com/laravel-sms/webhook/africastalking` e ative os [webhooks](/pt/guide/webhooks). As requisições são verificadas com um segredo `?token=` na URL de callback, usando o `AFRICASTALKING_WEBHOOK_SECRET` (a Africa's Talking não assina os callbacks).

Os relatórios verificados disparam o evento `SmsWebhookReceived`.
