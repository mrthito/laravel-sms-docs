# Votre premier SMS

<p class="lead">Un tour guidé des cinq choses que vous ferez le plus souvent : envoyer, vérifier le résultat, mettre en file d'attente, notifier et tester.</p>

## Envoyer un message {#send-a-message}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

Les numéros peuvent contenir des espaces, des tirets, des points et des parenthèses : `+1 (555) 123-4567` et `+15551234567` désignent le même destinataire. Utilisez autant que possible le format international, avec un `+` en tête. La plupart des fournisseurs en ont besoin pour acheminer le message.

## Vérifier ce qui s'est passé {#check-what-happened}

`sendNow()` envoie immédiatement et renvoie un `SmsResult` :

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // l'identifiant du message chez le fournisseur, à conserver
```

Si le fournisseur refuse le message, une `DeliveryException` vous en donne la raison :

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

La page [Résultats et erreurs](/fr/guide/results) détaille les échecs partiels et le contenu de chaque propriété.

## Le mettre en file d'attente {#queue-it}

Un envoi implique un aller-retour réseau. Pendant une requête web, mettez le message en file d'attente pour que vos utilisateurs n'aient pas à patienter :

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## L'envoyer sous forme de notification {#send-it-as-a-notification}

Si vous utilisez déjà les notifications Laravel, ajoutez le canal `sms` :

```php
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.");
    }
}
```

Le canal demande le numéro à votre modèle via `routeNotificationForSms()`. Tous les détails se trouvent dans [Notifications](/fr/guide/notifications).

## Le tester {#test-it}

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

Voilà l'essentiel du package. La suite de ce guide approfondit chaque partie, en commençant par [la composition des messages](/fr/guide/sending).
