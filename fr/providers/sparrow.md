# Sparrow SMS

<p class="lead">La passerelle SMS la plus utilisée au Népal, avec des routes directes vers NTC et Ncell.</p>

| | |
|---|---|
| Clé du driver | `sparrow` |
| Couverture | Népal |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [sparrowsms.com](https://sparrowsms.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| Variable | |
|---|---|
| `SPARROW_TOKEN` | Jeton d'API |
| `SPARROW_FROM` | Votre identité approuvée (expéditeur) |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +9779812345678 --provider=sparrow
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+9779812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Tous les destinataires partent en une seule requête.
- Écrivez les numéros népalais avec l'indicatif pays (`+97798…`) ou au format mobile local à dix chiffres (`98…`) : les deux sont acceptés.
