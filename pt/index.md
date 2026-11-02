---
layout: home

hero:
  name: Laravel SMS
  text: SMS do jeito Laravel.
  tagline: Envie pela Twilio hoje e pela Sinch amanhã sem mexer no código. Vinte provedores, uma API fluente e resultados com os quais você pode agir.
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: Começar
      link: /pt/guide/introduction
    - theme: alt
      text: Ver os provedores
      link: /pt/providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: Troque de provedor no .env
    details: Seu código conversa com uma única API. Mude o SMS_PROVIDER e a próxima mensagem já sai por outra rede.
  - title: Saiba o que aconteceu
    details: Todo envio devolve os IDs de mensagem do provedor. Quando algo falha, você sabe exatamente quais números foram recusados e quais passaram.
  - title: Failover sem mensagem repetida
    details: Se a Twilio aceitar 98 de 100 destinatários, só os outros dois seguem para a Vonage. Ninguém recebe a mesma mensagem duas vezes.
  - title: Rápido em envios grandes
    details: Provedores com suporte a envio em massa recebem uma única requisição. Os demais enviam em paralelo, dez por vez por padrão.
  - title: Seguro por padrão
    details: Webhooks sem assinatura são recusados. Mensagens na fila vão criptografadas. Credenciais não aparecem em mensagens de exceção nem em chaves de cache.
  - title: Um prazer de testar
    details: O Sms::fake() registra em vez de enviar, com asserções que se leem como frases. Todos os drivers funcionam com Http::fake().
---

<div class="home-section">

## Escreva uma vez {#write-it-once}

<p>A API é enxuta: para quem é, o que diz e onde você quer receber a resposta do provedor.</p>

<div class="home-code">
<div>
<div class="caption">Envie agora</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">Ou coloque na fila</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">A partir de uma notificação</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">Nos seus testes</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## Vinte provedores prontos para usar {#twenty-providers-ready-to-go}

<p>As plataformas globais, as redes regionais que chegam aonde elas não chegam e alguns drivers para desenvolvimento e testes.</p>

<div class="provider-cloud">
  <a href="/pt/providers/twilio">Twilio</a>
  <a href="/pt/providers/vonage">Vonage</a>
  <a href="/pt/providers/sinch">Sinch</a>
  <a href="/pt/providers/bird">Bird</a>
  <a href="/pt/providers/plivo">Plivo</a>
  <a href="/pt/providers/telnyx">Telnyx</a>
  <a href="/pt/providers/infobip">Infobip</a>
  <a href="/pt/providers/clicksend">ClickSend</a>
  <a href="/pt/providers/clickatell">Clickatell</a>
  <a href="/pt/providers/brevo">Brevo</a>
  <a href="/pt/providers/bandwidth">Bandwidth</a>
  <a href="/pt/providers/sendpulse">SendPulse</a>
  <a href="/pt/providers/aws-sns">Amazon SNS</a>
  <a href="/pt/providers/whatsapp">WhatsApp</a>
  <a href="/pt/providers/msg91">MSG91</a>
  <a href="/pt/providers/sparrow">Sparrow SMS</a>
  <a href="/pt/providers/termii">Termii</a>
  <a href="/pt/providers/sendchamp">Sendchamp</a>
  <a href="/pt/providers/africastalking">Africa's Talking</a>
  <a href="/pt/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## Funcionando em dois minutos {#up-and-running-in-two-minutes}

<p>Instale o pacote, adicione suas credenciais e envie uma mensagem de verdade pelo terminal antes de escrever uma linha de código.</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
