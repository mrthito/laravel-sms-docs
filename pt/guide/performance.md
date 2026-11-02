# Desempenho

<p class="lead">Enviar um SMS é, na maior parte do tempo, esperar o provedor responder. O pacote aproveita bem esse tempo: menos requisições quando o provedor permite, e requisições em paralelo quando não permite.</p>

## Provedores com envio em massa: uma requisição

Estes provedores aceitam vários destinatários em uma única chamada à API, então uma mensagem para 200 pessoas é uma só requisição HTTP:

**Sinch, Plivo, Infobip, ClickSend, Clickatell, Sparrow SMS, Sendchamp, Africa's Talking, BulkSMS, SendPulse** e os templates do **MSG91**.

A Clickatell aceita até 100 destinatários por chamada, então o pacote divide envios maiores em lotes automaticamente.

## Provedores por destinatário: em paralelo

**Twilio, Vonage, Telnyx, Bird, Brevo, Bandwidth, WhatsApp, Termii** e o **MSG91** com texto simples aceitam um destinatário por requisição. Em vez de esperar cada uma terminar para começar a próxima, o pacote as envia em paralelo usando o `Http::pool()` do Laravel.

Por padrão, rodam dez requisições por vez:

```ini [.env]
SMS_HTTP_CONCURRENCY=10
```

Com cerca de 300 ms por ida e volta ao provedor, 100 destinatários levam uns três segundos em vez de trinta. Aumente o número para lotes grandes se o rate limit do seu provedor permitir; diminua se aparecer `429 Too Many Requests`.

O Amazon SNS publica pelo SDK da AWS, um destinatário por vez.

## Timeouts

```ini [.env]
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
```

O timeout de conexão falha rápido quando um provedor está inacessível, o que faz mais diferença em uma cadeia de [failover](/pt/guide/failover): o próximo provedor entra em ação depois de 10 segundos, em vez de tudo ficar travado.

## Cache de tokens

A Bandwidth e a SendPulse usam OAuth. Os access tokens delas ficam no cache do Laravel até pouco antes de expirarem, então a maioria dos envios dispensa a ida e volta extra. Se um provedor recusar um token antes da hora, por exemplo depois de você trocar as credenciais, ele é descartado e o próximo envio busca um novo.

## Na sua aplicação

- **Coloque na fila os envios feitos durante requisições web.** As [filas](/pt/guide/queueing) tiram toda a espera de rede de dentro da requisição.
- **Use um provedor com envio em massa para lotes grandes.** Uma requisição escala muito melhor do que centenas.
- **Mantenha uma mensagem por lote.** Enviar uma mensagem para 500 números é muito mais rápido do que fazer 500 envios separados do mesmo texto.
