# Twilio

<p class="lead">L'API SMS la plus répandue. Une excellente délivrabilité en Amérique du Nord et en Europe, avec les Messaging Services pour gérer des pools d'expéditeurs et la conformité.</p>

| | |
|---|---|
| Clé du driver | `twilio` |
| Couverture | Monde |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.twilio.com](https://www.twilio.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| Variable | |
|---|---|
| `TWILIO_SID` | Account SID, commence par `AC` |
| `TWILIO_TOKEN` | Auth token |
| `TWILIO_FROM` | Numéro d'expéditeur ou identifiant alphanumérique |
| `TWILIO_MESSAGING_SERVICE_SID` | Facultatif. Utilise un Messaging Service au lieu d'un expéditeur unique (commence par `MG`) |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Il vous faut soit `TWILIO_FROM`, soit `TWILIO_MESSAGING_SERVICE_SID`. Un Messaging Service laisse Twilio choisir le meilleur numéro dans un pool et gère les désinscriptions à votre place.
- Quand un message définit `from()`, c'est cet expéditeur qui est utilisé, et le Messaging Service est ignoré pour ce message.
- Les comptes d'essai ne peuvent envoyer de SMS qu'aux numéros que vous avez vérifiés dans la console Twilio.
