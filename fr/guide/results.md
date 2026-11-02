# Résultats et erreurs

<p class="lead">Un SMS ne sert à rien s'il n'arrive pas. Chaque envoi vous dit ce que le fournisseur a accepté et, quand quelque chose tourne mal, précisément quels destinataires sont concernés.</p>

## Le résultat {#the-result}

`sendNow()` renvoie un `SmsResult` :

```php
$result = Sms::to(['+15551234567', '+15557654321'])
    ->message('Hi')
    ->sendNow();

$result->provider;      // "twilio"
$result->recipients();  // ["+15551234567", "+15557654321"]
$result->ids();         // ["SM1a…", "SM2b…"]
$result->firstId();     // "SM1a…"
count($result);         // 2

foreach ($result->messages as $sent) {
    $sent->to;      // "+15551234567"
    $sent->id;      // "SM1a…"
    $sent->status;  // "queued", tel que rapporté par le fournisseur
}
```

Conservez l'identifiant du message. C'est la clé des accusés de réception du fournisseur, des tickets de support (« où en est le message SM1a… ? ») et du rapprochement entre un [webhook](/fr/guide/webhooks) et le message qui l'a déclenché.

::: info Accepté ne veut pas dire livré
Un résultat signifie que le fournisseur a **accepté** le message. La livraison sur le téléphone a lieu quelques secondes plus tard, et peut encore échouer si l'appareil est éteint ou si le numéro a changé. Utilisez les [webhooks](/fr/guide/webhooks) pour suivre la livraison effective.
:::

`sendNow()` renvoie `null` dans un seul cas : un [listener de `SmsSending`](/fr/guide/events#cancelling-a-send) a annulé l'envoi. `send()` renvoie également `null` lorsqu'il a mis le message en file d'attente au lieu de l'envoyer.

## Quand un fournisseur dit non {#when-a-provider-says-no}

Un envoi refusé, ou qui n'a pas pu joindre le fournisseur, lève une `DeliveryException`. Son message est rédigé pour être lu par un humain, et peut être journalisé sans risque :

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

L'explication du fournisseur y figure, tronquée à 200 caractères. Vos identifiants d'accès, jamais.

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400, le statut HTTP quand il y en a un
    $e->failedRecipients;       // les numéros que le fournisseur n'a pas acceptés
    $e->partial?->recipients(); // ceux qu'il a acceptés avant d'échouer
}
```

## Échecs partiels {#partial-failures}

Envoyez un message à cent personnes, et l'un des numéros peut se révéler invalide. Le package ne prétend pas que tout l'envoi a échoué, et il ne vous cache pas non plus celui qui a échoué :

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 99 personnes ont reçu le message. Ne le leur renvoyez pas.
        $delivered = $e->partial->recipients();
    }

    // Réessayez, signalez ou remontez uniquement ceux-ci.
    $e->failedRecipients;
}
```

Le message indique aussi combien ont échoué : `… (1 of 100 recipients failed)`.

C'est également ce qui rend le [basculement](/fr/guide/failover) sûr : le fournisseur suivant ne reçoit jamais que les `failedRecipients`.

## Toutes les exceptions du package {#every-exception-the-package-throws}

Elles implémentent toutes `MrRijal\LaravelSms\Exceptions\SmsException` : un seul `catch` suffit donc pour l'ensemble du package.

| Exception | Hérite de | Levée lorsque |
|---|---|---|
| `DeliveryException` | `RuntimeException` | Un fournisseur a refusé le message, était injoignable, ou l'authentification a échoué |
| `InvalidMessageException` | `InvalidArgumentException` | Un numéro est mal formé, le texte est vide ou trop long, ou le fournisseur ne sait pas envoyer ce type de message |
| `InvalidConfigurationException` | `InvalidArgumentException` | Un fournisseur est inconnu, ou ses identifiants d'accès ou ses réglages sont absents ou invalides |

Les messages et configurations invalides échouent **avant** tout envoi : vous ne payez jamais pour une erreur à moitié commise.
