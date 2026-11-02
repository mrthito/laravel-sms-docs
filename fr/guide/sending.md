# Composer un message

<p class="lead">Tout envoi part de la façade <code>Sms</code> et se termine par l'un de quatre verbes. Ce qui se trouve entre les deux décrit le message.</p>

## Le builder {#the-builder}

Appeler `Sms::to()`, `Sms::provider()`, `Sms::message()` ou `Sms::template()` renvoie un `PendingSms` tout neuf. Enchaînez ce dont vous avez besoin, puis terminez par un verbe :

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // facultatif : SMS_PROVIDER par défaut
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // facultatif : remplace l'expéditeur configuré
    ->message('Doors open at 7pm.')
    ->send();
```

| Verbe | Effet | Valeur de retour |
|---|---|---|
| `send()` | Envoie tout de suite, ou met en file d'attente si `SMS_QUEUE=true` | `SmsResult`, ou `null` si mis en file d'attente |
| `sendNow()` | Envoie toujours immédiatement | `SmsResult` (ou `null` si un listener annule l'envoi) |
| `sendLater()` | Met toujours en file d'attente | rien |
| `sendLaterAt($when)` | Met en file d'attente avec un délai (`later()` en est un alias) | rien |

Comme chaque appel à la façade crée un nouveau builder, deux envois ne partagent jamais leurs destinataires ni leur texte, même dans un worker Octane qui tourne longtemps.

## Destinataires {#recipients}

`to()` accepte un numéro seul, un tableau ou n'importe quel itérable, collections comprises :

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

Chaque numéro est nettoyé et vérifié dès son ajout :

- Les espaces, tirets, points et parenthèses sont supprimés.
- Il doit rester entre 7 et 15 chiffres, éventuellement précédés d'un `+`. Dans le cas contraire, une `InvalidMessageException` est levée immédiatement, au lieu d'un échec plus tard chez le fournisseur.
- Les doublons sont écartés : une même personne ne reçoit jamais deux fois le même envoi.

::: tip Utilisez le format E.164
Stockez et envoyez vos numéros au format international : un `+` suivi de l'indicatif du pays et du numéro. Certains fournisseurs rejettent purement et simplement les formats locaux, d'autres les acheminent vers le mauvais pays.
:::

## Texte {#text}

```php
Sms::to($phone)->message('Your table is ready.');
```

Les espaces en début et en fin de texte sont supprimés, et le texte ne doit pas être vide. Un message peut compter jusqu'à 1 600 caractères. Au-delà d'un SMS (160 caractères GSM, ou 70 dès qu'il contient un emoji ou un autre caractère Unicode), les fournisseurs le découpent en plusieurs parties et facturent chacune d'elles : un message court coûte donc moins cher.

`content()` est un alias de `message()`, si vous préférez le vocabulaire des notifications Laravel.

## Modèles (templates) {#templates}

Certains fournisseurs envoient des modèles validés à l'avance plutôt que du texte libre. En Inde, la réglementation DLT les impose ; WhatsApp les exige pour les conversations initiées par une entreprise.

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

Les modèles sont pris en charge par [MSG91](/fr/providers/msg91), [WhatsApp](/fr/providers/whatsapp) et [Brevo](/fr/providers/brevo). Les autres fournisseurs ont besoin de texte : leur envoyer un message composé uniquement d'un modèle lève une `InvalidMessageException` qui nomme le fournisseur.

## Expéditeur {#sender}

Chaque fournisseur a un expéditeur configuré, par exemple un numéro ou un identifiant alphanumérique comme `ACME`. Pour le remplacer le temps d'un message, utilisez `from()` :

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

Les expéditeurs alphanumériques ne sont pas autorisés partout. Aux États-Unis et au Canada, vous devez envoyer depuis un numéro enregistré : vérifiez les règles de votre fournisseur pour chaque pays que vous ciblez.

## Choisir un fournisseur {#choosing-a-provider}

`provider()` fait passer ce message par un fournisseur précis plutôt que par celui par défaut :

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

Deux noms sont particuliers : `failover` essaie une chaîne de fournisseurs dans l'ordre, et `random` en tire un au sort dans un groupe. Tous deux sont présentés dans [Basculement et répartition de charge](/fr/guide/failover).

## Parties conditionnelles {#conditional-parts}

`PendingSms` prend en charge les méthodes `when()` et `unless()` de Laravel :

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## Préparer un message à l'avance {#building-a-message-ahead-of-time}

`SmsMessage` est un simple objet que vous pouvez construire, faire circuler et envoyer plus tard :

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## Macros {#macros}

Donnez un nom aux messages que vous envoyez régulièrement :

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Sms::macro('sendOtp', function (string $phone, int $code) {
        return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
    });
}

// N'importe où dans votre application
Sms::sendOtp($user->phone, 4821);
```
