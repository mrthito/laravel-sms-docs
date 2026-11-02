# Configuração

<p class="lead">Tudo o que existe no <code>config/sms.php</code> e a variável de ambiente que define cada opção. Publique o arquivo com <code>php artisan vendor:publish --tag=sms-config</code>; raramente você vai precisar editá-lo.</p>

## Envio {#sending}

| Opção | Variável de ambiente | Padrão | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | Provedor usado quando a mensagem não indica um. Também aceita `failover` e `random`. |
| `random_drivers` | — | `['twilio', 'msg91']` | O pool de onde o `random` sorteia. |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | Cadeia do `failover`, separada por vírgulas, tentada em ordem. |

## Filas {#queueing}

| Opção | Variável de ambiente | Padrão | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | Quando `true`, o `send()` coloca na fila em vez de enviar na hora. |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | a sua padrão | Conexão de fila para os jobs de SMS. |
| `queue_name` | `SMS_QUEUE_NAME` | a sua padrão | Nome da fila para os jobs de SMS. |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | Tentativas por destinatário antes de o job falhar. |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | Segundos que um job pode rodar. Mantenha o `retry_after` da sua fila acima disso. |
| `retry.backoff` | — | `[10, 30, 60]` | Segundos de espera antes de cada nova tentativa. |

## HTTP {#http}

| Opção | Variável de ambiente | Padrão | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | Segundos de espera pela resposta do provedor. |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | Segundos de espera para conectar. |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | Requisições em paralelo para provedores de um destinatário por requisição. |

## Webhooks {#webhooks}

| Opção | Variável de ambiente | Padrão | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | Registra a rota de webhook. |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | Prefixo da URL; a chave do provedor é adicionada no final. |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | Middleware aplicado à rota. |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | App secret da Meta. |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | Token para a verificação de assinatura da Meta. |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | Passado como `?token=` na URL de callback. |

## Drivers e provedores {#drivers-and-providers}

Dois mapas ligam a chave de um provedor ao código e às credenciais dele:

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

O `drivers` define qual classe trata cada chave, e o `providers` guarda as configurações dessa chave, que são repassadas à classe. A [página de cada provedor](/pt/providers/) lista as configurações dele.

Para usar o mesmo provedor com duas contas, digamos uma transacional e outra de marketing, registre a classe duas vezes com chaves diferentes:

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## Cache de configuração {#config-caching}

A configuração não tem closures, então o `php artisan config:cache` funciona normalmente. Depois de alterar o `.env` em produção, rode-o de novo.
