---
layout: home

hero:
  name: Laravel SMS
  text: Mensajes de texto al estilo Laravel.
  tagline: Envía hoy con Twilio y mañana con Sinch sin tocar tu código. Veinte proveedores, una API fluida y resultados con los que puedes actuar.
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: Empezar
      link: /es/guide/introduction
    - theme: alt
      text: Ver proveedores
      link: /es/providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: Cambia de proveedor desde el .env
    details: Tu código habla con una sola API. Cambia SMS_PROVIDER y el siguiente mensaje sale por otra red.
  - title: Sabes qué pasó con cada envío
    details: Cada envío devuelve los IDs de mensaje del proveedor. Si algo falla, sabes exactamente qué números se rechazaron y cuáles llegaron.
  - title: Failover sin mensajes duplicados
    details: Si Twilio acepta 98 de 100 destinatarios, solo los otros dos pasan a Vonage. Nadie recibe tu mensaje dos veces.
  - title: Rápido con lotes grandes
    details: Los proveedores que admiten envío masivo reciben una sola petición. Con el resto se envía en paralelo, de diez en diez por defecto.
  - title: Seguro desde el primer momento
    details: Los webhooks rechazan todo lo que no venga firmado. Los mensajes en cola van cifrados. Las credenciales nunca aparecen en mensajes de excepción ni en claves de caché.
  - title: Da gusto probarlo
    details: Sms::fake() registra los mensajes en lugar de enviarlos, con aserciones que se leen como frases. Todos los drivers funcionan con Http::fake().
---

<div class="home-section">

## Escríbelo una vez {#write-it-once}

<p>La API es pequeña: a quién va dirigido, qué dice y dónde quieres recibir la respuesta del proveedor.</p>

<div class="home-code">
<div>
<div class="caption">Envíalo ya</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">O mándalo a la cola</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">Desde una notificación</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">En tus pruebas</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## Veinte proveedores listos para usar {#twenty-providers-ready-to-go}

<p>Las plataformas globales, las redes regionales que llegan a donde ellas no llegan y algunos drivers para desarrollo y pruebas.</p>

<div class="provider-cloud">
  <a href="/es/providers/twilio">Twilio</a>
  <a href="/es/providers/vonage">Vonage</a>
  <a href="/es/providers/sinch">Sinch</a>
  <a href="/es/providers/bird">Bird</a>
  <a href="/es/providers/plivo">Plivo</a>
  <a href="/es/providers/telnyx">Telnyx</a>
  <a href="/es/providers/infobip">Infobip</a>
  <a href="/es/providers/clicksend">ClickSend</a>
  <a href="/es/providers/clickatell">Clickatell</a>
  <a href="/es/providers/brevo">Brevo</a>
  <a href="/es/providers/bandwidth">Bandwidth</a>
  <a href="/es/providers/sendpulse">SendPulse</a>
  <a href="/es/providers/aws-sns">Amazon SNS</a>
  <a href="/es/providers/whatsapp">WhatsApp</a>
  <a href="/es/providers/msg91">MSG91</a>
  <a href="/es/providers/sparrow">Sparrow SMS</a>
  <a href="/es/providers/termii">Termii</a>
  <a href="/es/providers/sendchamp">Sendchamp</a>
  <a href="/es/providers/africastalking">Africa's Talking</a>
  <a href="/es/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## Funcionando en dos minutos {#up-and-running-in-two-minutes}

<p>Instala el paquete, añade tus credenciales y envía un mensaje real desde la terminal antes de escribir una sola línea de código.</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
