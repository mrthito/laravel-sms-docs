# Como escolher um provedor

<p class="lead">Todos os provedores funcionam pela mesma API, então essa escolha tem a ver com preço, alcance e burocracia, não com código. Para trocar depois, basta adicionar as credenciais do novo provedor e mudar o <code>SMS_PROVIDER</code>; o seu código continua o mesmo.</p>

## Visão geral {#at-a-glance}

| Provedor | Chave | Cobertura | Envio | Templates | Webhooks |
|---|---|---|---|---|---|
| [Twilio](/pt/providers/twilio) | `twilio` | Global | Paralelo |  |  |
| [Vonage](/pt/providers/vonage) | `vonage` | Global | Paralelo |  |  |
| [Sinch](/pt/providers/sinch) | `sinch` | Global | Em massa |  |  |
| [Bird](/pt/providers/bird) | `bird` | Global | Paralelo |  |  |
| [Plivo](/pt/providers/plivo) | `plivo` | Global | Em massa |  |  |
| [Telnyx](/pt/providers/telnyx) | `telnyx` | Global | Paralelo |  |  |
| [Infobip](/pt/providers/infobip) | `infobip` | Global | Em massa |  |  |
| [ClickSend](/pt/providers/clicksend) | `clicksend` | Global | Em massa |  |  |
| [Clickatell](/pt/providers/clickatell) | `clickatell` | Global | Em massa |  |  |
| [Brevo](/pt/providers/brevo) | `brevo` | Global | Paralelo | ✓ |  |
| [Bandwidth](/pt/providers/bandwidth) | `bandwidth` | Estados Unidos e Canadá | Paralelo |  |  |
| [SendPulse](/pt/providers/sendpulse) | `sendpulse` | Global | Em massa |  |  |
| [Amazon SNS](/pt/providers/aws-sns) | `aws_sns` | Global | SDK |  |  |
| [WhatsApp](/pt/providers/whatsapp) | `whatsapp` | Global | Paralelo | ✓ | ✓ |
| [MSG91](/pt/providers/msg91) | `msg91` | Índia | Ambos | ✓ |  |
| [Sparrow SMS](/pt/providers/sparrow) | `sparrow` | Nepal | Em massa |  |  |
| [Termii](/pt/providers/termii) | `termii` | Nigéria e África | Paralelo |  | ✓ |
| [Sendchamp](/pt/providers/sendchamp) | `sendchamp` | Nigéria e África | Em massa |  | ✓ |
| [Africa's Talking](/pt/providers/africastalking) | `africastalking` | África inteira | Em massa |  | ✓ |
| [BulkSMS](/pt/providers/bulksms) | `bulksms` | Global, mais forte no sul da África | Em massa |  | ✓ |

Provedores **em massa** recebem todos os destinatários em uma única requisição. Provedores **paralelos** recebem um destinatário por requisição, e o pacote envia essas requisições [em paralelo](/pt/guide/performance).

## Escolhendo {#picking-one}

**Comece por onde estão os seus usuários.** Os provedores globais chegam a quase todos os países, mas os gateways locais costumam ser mais baratos e mais confiáveis dentro de casa. Na Nigéria, a [Termii](/pt/providers/termii) e a [Sendchamp](/pt/providers/sendchamp) contornam as restrições de Do-Not-Disturb que barram muitos remetentes internacionais. Na Índia, o [MSG91](/pt/providers/msg91) cuida do registro na DLT. No Nepal, o [Sparrow SMS](/pt/providers/sparrow) se conecta diretamente às duas operadoras.

**Depois, pense no que você envia.**

- *Códigos de login e alertas* precisam mais de entrega rápida e confiável do que de preço baixo. Twilio, Sinch, Vonage e Infobip têm as conexões diretas com operadoras mais amplas.
- *Comunicados grandes* combinam com provedores de envio em massa, que mandam para todo mundo em uma única requisição: Sinch, Plivo, Infobip, ClickSend, Clickatell.
- *Conversas* em que o cliente responde pedem o [WhatsApp](/pt/providers/whatsapp) ou um provedor com números bidirecionais e webhooks de entrega.

**E no que você já tem.** Já está na AWS? O [Amazon SNS](/pt/providers/aws-sns) cobra na sua conta atual. Já envia e-mail pela Brevo? O [SMS](/pt/providers/brevo) dela fica no mesmo painel.

::: tip Não dependa de uma única rede
Seja qual for a sua escolha, coloque um segundo provedor por trás com [failover](/pt/guide/failover). Quedas são raras, mas quando acontecem, seus códigos de login continuam chegando.
:::

## Sender IDs e registro {#sender-ids-and-registration}

Hoje a maioria dos países exige algum tipo de registro antes de você enviar SMS de aplicação para pessoa (A2P) em escala:

- **Estados Unidos:** registro de marca e de campanha 10DLC, ou um número toll-free verificado.
- **Índia:** registro na DLT do seu sender ID e de cada template de mensagem.
- **Muitos outros países** exigem que sender IDs alfanuméricos sejam registrados com antecedência.

O seu provedor orienta você nesse processo. Reserve alguns dias antes do lançamento.

## Para desenvolvimento e testes {#for-development-and-tests}

| Driver | Use para |
|---|---|
| [`log`](/pt/providers/log) | Desenvolvimento local. Grava cada mensagem no log do Laravel em vez de enviá-la. |
| [`fake`](/pt/guide/testing) | Testes automatizados. Use `Sms::fake()` para as asserções. |
| [`failover`](/pt/guide/failover) | Encadear provedores reais para ter mais resiliência. |
