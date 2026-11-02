---
layout: home

hero:
  name: Laravel SMS
  text: "Les SMS, à la manière de Laravel."
  tagline: "Envoyez via Twilio aujourd'hui et via Sinch demain sans toucher à votre code. Vingt fournisseurs, une seule API fluide, et des résultats exploitables."
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: Commencer
      link: /fr/guide/introduction
    - theme: alt
      text: Voir les fournisseurs
      link: /fr/providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: "Changez de fournisseur dans le .env"
    details: "Votre code ne connaît qu'une seule API. Modifiez SMS_PROVIDER et le message suivant part par un autre réseau."
  - title: "Sachez ce qui s'est passé"
    details: "Chaque envoi renvoie les identifiants de message du fournisseur. En cas d'échec, vous savez précisément quels numéros ont été refusés et lesquels sont passés."
  - title: "Un basculement sans doublons"
    details: "Si Twilio accepte 98 destinataires sur 100, seuls les deux restants passent chez Vonage. Personne ne reçoit votre message deux fois."
  - title: "Rapide sur les gros volumes"
    details: "Les fournisseurs qui acceptent l'envoi groupé reçoivent une seule requête. Pour les autres, les envois partent en parallèle, dix à la fois par défaut."
  - title: "Sécurisé par défaut"
    details: "Les webhooks rejettent toute requête non signée. Les messages en file d'attente sont chiffrés. Les identifiants d'accès n'apparaissent ni dans les messages d'exception ni dans les clés de cache."
  - title: "Agréable à tester"
    details: "Sms::fake() enregistre au lieu d'envoyer, avec des assertions qui se lisent comme des phrases. Chaque driver fonctionne avec Http::fake()."
---

<div class="home-section">

## Écrivez-le une fois {#write-it-once}

<p>L'API reste compacte : à qui s'adresse le message, ce qu'il dit, et où vous voulez recevoir la réponse du fournisseur.</p>

<div class="home-code">
<div>
<div class="caption">Envoyer tout de suite</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">Ou le mettre en file d'attente</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">Depuis une notification</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">Dans vos tests</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## Vingt fournisseurs, prêts à l'emploi {#twenty-providers-ready-to-go}

<p>Les grandes plateformes internationales, les réseaux régionaux qui vont là où elles ne vont pas, et quelques drivers pour le développement et les tests.</p>

<div class="provider-cloud">
  <a href="/fr/providers/twilio">Twilio</a>
  <a href="/fr/providers/vonage">Vonage</a>
  <a href="/fr/providers/sinch">Sinch</a>
  <a href="/fr/providers/bird">Bird</a>
  <a href="/fr/providers/plivo">Plivo</a>
  <a href="/fr/providers/telnyx">Telnyx</a>
  <a href="/fr/providers/infobip">Infobip</a>
  <a href="/fr/providers/clicksend">ClickSend</a>
  <a href="/fr/providers/clickatell">Clickatell</a>
  <a href="/fr/providers/brevo">Brevo</a>
  <a href="/fr/providers/bandwidth">Bandwidth</a>
  <a href="/fr/providers/sendpulse">SendPulse</a>
  <a href="/fr/providers/aws-sns">Amazon SNS</a>
  <a href="/fr/providers/whatsapp">WhatsApp</a>
  <a href="/fr/providers/msg91">MSG91</a>
  <a href="/fr/providers/sparrow">Sparrow SMS</a>
  <a href="/fr/providers/termii">Termii</a>
  <a href="/fr/providers/sendchamp">Sendchamp</a>
  <a href="/fr/providers/africastalking">Africa's Talking</a>
  <a href="/fr/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## Opérationnel en deux minutes {#up-and-running-in-two-minutes}

<p>Installez le package, ajoutez vos identifiants d'accès et envoyez un vrai message depuis le terminal avant même d'écrire une ligne de code.</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
