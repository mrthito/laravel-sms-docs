# MSG91

<p class="lead">Une passerelle indienne de premier plan. Les messages à base de modèle passent par les Flows MSG91, qui gèrent l'enregistrement DLT à votre place.</p>

| | |
|---|---|
| Clé du driver | `msg91` |
| Couverture | Inde |
| Envoi | Modèles : une seule requête pour tous les destinataires. Texte libre : une requête par destinataire, en parallèle. |
| Modèles | Oui |
| Webhooks de livraison | Non |
| Site web | [msg91.com](https://msg91.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| Variable | |
|---|---|
| `MSG91_AUTHKEY` | Auth key |
| `MSG91_SENDER` | Identifiant d'expéditeur de six caractères, enregistré sur DLT |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +919812345678 --provider=msg91
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- La réglementation indienne (DLT) impose que chaque message commercial corresponde à un modèle enregistré. Créez un Flow dans MSG91, puis envoyez-le avec `->template($flowId, ['otp' => 4821])`. Tous les destinataires partent en une seule requête, et chacun reçoit les mêmes variables.
- Les messages en texte libre passent par l'API v2 de MSG91, un destinataire par requête, et n'atteignent les numéros indiens que si le texte correspond exactement à un modèle DLT.
