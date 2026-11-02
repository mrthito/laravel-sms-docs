# Plivo

<p class="lead">Un fournisseur international au bon rapport qualité-prix, doté d'une API REST simple. Envoie tous les destinataires en une seule requête.</p>

| | |
|---|---|
| Clé du driver | `plivo` |
| Couverture | Monde |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.plivo.com](https://www.plivo.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| Variable | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth token |
| `PLIVO_FROM` | Numéro d'expéditeur ou identifiant alphanumérique |
| `PLIVO_LOG_MESSAGES` | Facultatif, `false` par défaut. Indique si Plivo conserve le contenu des messages et les numéros dans ses journaux |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Ici, la journalisation du contenu côté Plivo est **désactivée** par défaut : le texte des messages n'est pas conservé dans leur tableau de bord. Ne l'activez que si vous en avez besoin pour déboguer.
- Chaque destinataire reçoit son propre UUID de message Plivo, dans le même ordre que vos destinataires.
