# Recursos

<p class="lead">Tudo o que o pacote faz, em uma só página. Cada item leva à parte do guia que o explica.</p>

## Envio {#sending}

| | |
|---|---|
| **Uma API, vinte provedores** | Twilio, Vonage, Sinch, Bird, Plivo, Telnyx, Infobip, ClickSend, Clickatell, Brevo, Bandwidth, SendPulse, Amazon SNS, WhatsApp, MSG91, Sparrow SMS, Termii, Sendchamp, Africa's Talking e BulkSMS. [Provedores →](/pt/providers/) |
| **Builder fluente** | `Sms::to()->message()->send()`, com uma mensagem nova a cada chamada. [Montando mensagens →](/pt/guide/sending) |
| **Limpeza de números** | Espaços, hífens, pontos e parênteses removidos, duplicatas descartadas, números inválidos recusados antes do envio. [Destinatários →](/pt/guide/sending#recipients) |
| **Troca de remetente** | `->from('ACME')` por mensagem. [Remetente →](/pt/guide/sending#sender) |
| **Templates** | Flows do MSG91 (DLT), templates do WhatsApp e da Brevo, com texto de reserva para os outros provedores. [Templates →](/pt/guide/templates) |
| **Macros** | Dê nome às mensagens que se repetem: `Sms::sendOtp($phone, $code)`. [Macros →](/pt/guide/sending#macros) |

## Confiabilidade {#reliability}

| | |
|---|---|
| **Resultados com IDs de mensagem** | Todo envio devolve os IDs do provedor para cada destinatário aceito. [Resultados →](/pt/guide/results) |
| **Falhas precisas** | A `DeliveryException` lista os destinatários que falharam e os que passaram. [Falhas parciais →](/pt/guide/results#partial-failures) |
| **Failover** | Encadeie provedores; só os destinatários recusados seguem adiante, então ninguém recebe a mensagem duas vezes. [Failover →](/pt/guide/failover) |
| **Balanceamento de carga** | Distribua as mensagens entre um pool de provedores. [Balanceamento de carga →](/pt/guide/failover#load-balancing) |
| **Filas** | `sendLater()`, `sendLaterAt()`, um job criptografado por destinatário, com retentativas. [Filas →](/pt/guide/queueing) |

## Velocidade {#speed}

| | |
|---|---|
| **Requisições em massa** | Provedores com endpoint de envio em massa recebem todos os destinatários em uma única chamada. [Desempenho →](/pt/guide/performance) |
| **Requisições em paralelo** | Os demais rodam em paralelo, dez por vez por padrão. [Desempenho →](/pt/guide/performance#per-recipient-providers-in-parallel) |
| **Cache de tokens** | Tokens OAuth são reaproveitados até expirarem. [Cache de tokens →](/pt/guide/performance#token-caching) |

## Integração com o Laravel {#laravel-integration}

| | |
|---|---|
| **Canal de notificação** | O `via()` devolve `'sms'` e o `toSms()` devolve a mensagem. [Notificações →](/pt/guide/notifications) |
| **Eventos** | `SmsSending` (cancelável), `SmsSent`, `SmsFailed` e `SmsWebhookReceived`. O Laravel encontra suas classes de listener sozinho. [Eventos →](/pt/guide/events) |
| **Webhooks** | Relatórios de entrega assinados para WhatsApp, Termii, Sendchamp, Africa's Talking e BulkSMS. [Webhooks →](/pt/guide/webhooks) |
| **Artisan** | `php artisan sms:test` e uma seção no `php artisan about`. [Artisan →](/pt/reference/artisan) |
| **Seguro no Octane e nas filas** | Nenhum estado compartilhado entre envios ou requisições. |

## Testes {#testing}

| | |
|---|---|
| **`Sms::fake()`** | Registra as mensagens em vez de enviá-las, com asserções fáceis de ler. [Testes →](/pt/guide/testing) |
| **`Http::fake()`** | Todo driver HTTP roda sobre o HTTP client do Laravel. [Testando um driver →](/pt/guide/testing#testing-a-driver) |

## Segurança {#security}

| | |
|---|---|
| **Webhooks que falham fechados** | Requisições sem assinatura ou que não podem ser verificadas são recusadas. [Webhooks →](/pt/guide/webhooks) |
| **Payloads da fila criptografados** | Códigos e números são criptografados com a sua `APP_KEY`. [Filas →](/pt/guide/queueing#encrypted-at-rest) |
| **Cuidado com credenciais** | Nenhum segredo em mensagens de exceção, URLs ou chaves de cache; números mascarados nos logs. [Segurança →](/pt/guide/security) |

## Extensão {#extending}

| | |
|---|---|
| **Drivers próprios** | Estenda o `HttpDriver` e descreva só a API do provedor. [Drivers próprios →](/pt/guide/custom-drivers) |
| **Registro em tempo de execução** | `Sms::extend('acme', …)` a partir de um service provider. [Registrando em tempo de execução →](/pt/guide/custom-drivers#registering-at-runtime) |
