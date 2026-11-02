# Sinch

<p class="lead">Une plateforme de niveau opérateur, connectée directement aux opérateurs de nombreux pays. Envoie tous les destinataires en une seule requête groupée.</p>

| | |
|---|---|
| Clé du driver | `sinch` |
| Couverture | Monde |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [sinch.com](https://sinch.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| Variable | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | Identifiant du service plan, depuis le tableau de bord SMS |
| `SINCH_API_TOKEN` | Jeton d'API de ce service plan |
| `SINCH_FROM` | Numéro d'expéditeur ou identifiant alphanumérique |
| `SINCH_REGION` | `us` (par défaut), `eu`, `au`, `br` ou `ca` ; doit correspondre à la région de votre compte |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Utilisez la région dans laquelle votre service plan a été créé. En cas de discordance, vous obtenez une `401`, même avec un jeton valide.
- L'ensemble du lot partage un même identifiant de batch Sinch, que vous récupérez avec `$result->firstId()`.
