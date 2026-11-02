# Modèles de message

<p class="lead">Certains messages ne peuvent pas être rédigés librement. En Inde, tout SMS commercial doit correspondre à un modèle enregistré, et WhatsApp ne laisse une entreprise ouvrir une conversation qu'avec un modèle approuvé. Cette page explique comment configurer et envoyer des modèles.</p>

## Quand un modèle est nécessaire {#when-you-need-a-template}

| Situation | Pourquoi |
|---|---|
| Envoi vers des numéros indiens | La réglementation DLT impose que chaque message commercial corresponde à un modèle enregistré auprès des opérateurs |
| Ouverture d'une conversation WhatsApp | En dehors des 24 heures qui suivent le dernier message d'un client, WhatsApp ne livre que des modèles approuvés |
| Sortir les textes du code | Les équipes marketing ou support peuvent modifier la formulation dans le tableau de bord du fournisseur, sans déploiement |

Les modèles sont pris en charge par **[MSG91](/fr/providers/msg91)**, **[WhatsApp](/fr/providers/whatsapp)** et **[Brevo](/fr/providers/brevo)**. Tous les autres fournisseurs envoient du texte.

## Envoyer un modèle {#sending-a-template}

Passez l'identifiant du modèle et ses variables :

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

L'identifiant et les variables n'ont pas tout à fait le même sens d'un fournisseur à l'autre.

## Comment chaque fournisseur les interprète {#how-each-provider-reads-them}

### MSG91 {#msg91}

L'identifiant est le **Flow ID** du tableau de bord MSG91. Les noms des variables doivent correspondre à ceux de votre Flow, et tous les destinataires reçoivent les mêmes valeurs.

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

Tous les destinataires partent en une seule requête. Votre identifiant d'expéditeur (`MSG91_SENDER`) doit être enregistré sur DLT avec le modèle.

### WhatsApp {#whatsapp}

L'identifiant est le **nom du modèle**, exactement tel qu'il apparaît dans WhatsApp Manager. Les variables remplissent les emplacements du corps du modèle **dans l'ordre** : la première valeur remplace <code v-pre>{{1}}</code>, la deuxième <code v-pre>{{2}}</code>, et ainsi de suite. Les clés du tableau ne servent qu'à la lisibilité de votre code.

```php
// Modèle "order_update" : "Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

Chaque message utilise la langue définie dans `WHATSAPP_TEMPLATE_LANGUAGE` (`en` par défaut). Elle doit correspondre à une langue dans laquelle votre modèle a été approuvé, par exemple `en_US` ou `pt_BR`.

::: info Corps du message uniquement
Le driver remplit les emplacements du corps. Les modèles comportant un média d'en-tête, des boutons d'URL ou d'autres composants nécessitent d'appeler directement l'API WhatsApp, ou d'écrire un [driver sur mesure](/fr/guide/custom-drivers).
:::

### Brevo {#brevo}

L'identifiant est l'**identifiant du modèle SMS** dans Brevo, et les variables deviennent les `params` du modèle :

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## Modèles avec texte de repli {#templates-with-a-text-fallback}

Un message peut porter à la fois un modèle **et** du texte brut. Les fournisseurs qui gèrent les modèles envoient le modèle ; tous les autres envoient le texte. Les modèles se combinent ainsi sans risque avec le [basculement](/fr/guide/failover) :

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

MSG91 envoie le modèle DLT. S'il est indisponible, Twilio envoie le texte à sa place.

Un message composé uniquement d'un modèle et adressé à un fournisseur qui n'accepte que du texte lève une `InvalidMessageException` nommant le fournisseur, avant tout envoi. Dans une chaîne de basculement, ce fournisseur est simplement ignoré.

## Sortir les identifiants de modèle du code {#keeping-template-ids-out-of-your-code}

Les identifiants de modèle sont des chaînes opaques, faciles à mal recopier. Une enum typée (backed enum) donne à chaque modèle un nom, l'autocomplétion et un endroit unique où le modifier :

```php
namespace App\Enums;

enum SmsTemplate: string
{
    case LoginCode = '6512a8d3f1c2b';
    case OrderShipped = '6512a9e07a4d1';
}
```

```php
use App\Enums\SmsTemplate;

Sms::to($user->phone)
    ->template(SmsTemplate::LoginCode->value, ['otp' => $code])
    ->send();
```

Si les identifiants changent d'un environnement à l'autre, rangez-les plutôt dans `config/services.php` et lisez-les avec `config('services.msg91.templates.login_code')`.

## Modèles dans les notifications {#templates-in-notifications}

`toSms()` peut renvoyer un message à base de modèle comme n'importe quel autre :

```php
use App\Enums\SmsTemplate;
use MrRijal\LaravelSms\SmsMessage;

public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create()
        ->template(SmsTemplate::OrderShipped->value, ['order' => $this->order->number])
        ->provider('msg91');
}
```

Ou utilisez la notification prête à l'emploi :

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## Tester les messages à base de modèle {#testing-template-messages}

`Sms::fake()` enregistre l'identifiant du modèle et ses variables : vous pouvez donc les vérifier dans vos assertions.

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
