# API

<p class="lead">Les classes et méthodes publiques dont vous vous servirez au quotidien, réunies sur une seule page.</p>

## Façade Sms {#sms-facade}

`MrRijal\LaravelSms\Facades\Sms` délègue au `SmsManager`.

| Méthode | Renvoie | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | Commence un message pour ces numéros |
| `provider(string $name)` | `PendingSms` | Commence un message via un fournisseur précis |
| `message(string $text)` | `PendingSms` | Commence un message avec ce texte |
| `template(string $id, array $vars = [])` | `PendingSms` | Commence un message à base de modèle |
| `compose(?SmsMessage $message = null)` | `PendingSms` | Enveloppe un message existant dans un builder |
| `send(SmsMessage $message)` | `?SmsResult` | Envoie, ou met en file d'attente si `sms.queue` est activé |
| `sendNow(SmsMessage $message)` | `?SmsResult` | Envoie immédiatement |
| `queue(SmsMessage $message, $delay = null)` | `void` | Met en file d'attente un job par destinataire |
| `driver(?string $name = null)` | `SmsProvider` | L'instance du driver d'un fournisseur |
| `extend(string $name, Closure $factory)` | `SmsManager` | Enregistre un driver sur mesure |
| `getDefaultDriver()` | `string` | La clé du fournisseur par défaut |
| `forgetDrivers()` | `SmsManager` | Supprime les instances de drivers en cache |
| `macro(string $name, callable $macro)` | `void` | Ajoute votre propre méthode |
| `fake()` | `SmsFake` | Remplace le manager par un fake qui enregistre les envois |

## PendingSms {#pendingsms}

Renvoyé par la façade ; toutes les méthodes, à l'exception des quatre verbes, renvoient le builder.

| Méthode | |
|---|---|
| `to(string\|iterable $numbers)` | Ajoute des destinataires |
| `message(string $text)` / `content(string $text)` | Définit le texte |
| `template(string $id, array $vars = [])` | Utilise un modèle du fournisseur |
| `from(?string $sender)` | Remplace l'expéditeur |
| `provider(string $name)` | Choisit le fournisseur |
| `when($condition, $callback)` / `unless(…)` | Applique des modifications sous condition |
| `getMessage()` | Le `SmsMessage` sous-jacent |
| `send()` → `?SmsResult` | Envoie, ou met en file d'attente si `sms.queue` est activé |
| `sendNow()` → `?SmsResult` | Envoie immédiatement |
| `sendLater()` | Met en file d'attente |
| `sendLaterAt($when)` / `later($when)` | Met en file d'attente avec un délai : une date, un intervalle ou un nombre de secondes |

## SmsMessage {#smsmessage}

`MrRijal\LaravelSms\SmsMessage` représente un message. Les setters renvoient le message, ce qui permet de les enchaîner.

| Méthode | |
|---|---|
| `SmsMessage::create(?string $text = null)` | Nouveau message, avec ou sans texte |
| `to()`, `message()`, `content()`, `template()`, `from()`, `provider()` | Comme sur `PendingSms` |
| `getTo()` → `list<string>` | Destinataires normalisés |
| `getText()`, `getTemplateId()`, `getFrom()`, `getProvider()` → `?string` | |
| `getVariables()` → `array` | Variables du modèle |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | Une copie adressée à d'autres numéros |
| `getRedactedRecipientsForLogging()` → `list<string>` | Numéros masqués sous la forme `***4567` |
| `validate()` | Lève une `InvalidMessageException` si le message ne peut pas être envoyé |

## SmsResult {#smsresult}

| Membre | |
|---|---|
| `$provider` | Clé du fournisseur par lequel le message est passé |
| `$messages` | `list<SentMessage>`, un par destinataire accepté |
| `recipients()` → `list<string>` | Numéros acceptés |
| `ids()` → `list<string>` | Identifiants de message distincts du fournisseur |
| `firstId()` → `?string` | Le premier identifiant de message |
| `count()` | Nombre de destinataires acceptés |

`SentMessage` possède trois propriétés en lecture seule : `$to`, `$id` et `$status`.

## Exceptions {#exceptions}

Toutes dans `MrRijal\LaravelSms\Exceptions`, et toutes implémentent `SmsException`.

| Classe | Membres |
|---|---|
| `DeliveryException` | `$provider`, `$failedRecipients`, `$partial` (`?SmsResult`), `hasPartialDelivery()`, `getCode()` (le statut HTTP) |
| `InvalidMessageException` | Numéro mal formé, texte vide ou trop long, type de message non pris en charge |
| `InvalidConfigurationException` | Fournisseur inconnu, réglages absents ou invalides |

## Contrats {#contracts}

| Interface | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult` : à implémenter pour écrire un driver |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response` : pour recevoir les webhooks d'un fournisseur |
| `Contracts\Factory` | Lié au manager ; typez-le pour l'injection de dépendances |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
