# Africa's Talking

<p class="lead">Des connexions directes aux opérateurs de plus de 20 pays africains, avec une sandbox gratuite pour le développement.</p>

| | |
|---|---|
| Clé du driver | `africastalking` |
| Couverture | Toute l'Afrique |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Oui |
| Site web | [africastalking.com](https://africastalking.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| Variable | |
|---|---|
| `AFRICASTALKING_API_KEY` | Clé d'API |
| `AFRICASTALKING_USERNAME` | Nom d'utilisateur de l'application (`sandbox` pendant les tests) |
| `AFRICASTALKING_FROM` | Identifiant d'expéditeur ou short code facultatif |
| `AFRICASTALKING_SANDBOX` | `true` pour utiliser l'API sandbox |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- En mode sandbox, les messages apparaissent dans le simulateur d'Africa's Talking au lieu d'arriver sur de vrais téléphones. Définissez `AFRICASTALKING_USERNAME=sandbox` et `AFRICASTALKING_SANDBOX=true` ensemble.
- Africa's Talking indique le statut de chaque destinataire. Les numéros refusés, par exemple pour solde insuffisant, sont listés dans la `DeliveryException`.

## Accusés de réception {#delivery-reports}

Faites pointer l'URL des accusés de réception d'Africa's Talking vers `https://your-app.com/laravel-sms/webhook/africastalking` et activez les [webhooks](/fr/guide/webhooks). Africa's Talking ne signant pas ses callbacks, les requêtes sont vérifiées grâce à un secret `?token=` placé dans l'URL de callback, à l'aide de `AFRICASTALKING_WEBHOOK_SECRET`.

Chaque accusé de réception vérifié déclenche l'événement `SmsWebhookReceived`.
