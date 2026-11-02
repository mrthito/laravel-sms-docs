# Bandwidth

<p class="lead">Un opérateur américain propriétaire de son réseau, utilisé par nombre des grandes plateformes de communication. S'authentifie avec OAuth 2.0.</p>

| | |
|---|---|
| Clé du driver | `bandwidth` |
| Couverture | États-Unis et Canada |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.bandwidth.com](https://www.bandwidth.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| Variable | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | Identifiant du compte |
| `BANDWIDTH_APPLICATION_ID` | Application de messagerie liée à votre numéro |
| `BANDWIDTH_CLIENT_ID` | Client ID OAuth |
| `BANDWIDTH_CLIENT_SECRET` | Client secret OAuth |
| `BANDWIDTH_FROM` | Un numéro Bandwidth attribué à cette application |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Le driver échange votre client ID et votre secret contre un jeton d'accès, qu'il met en cache pendant environ une heure. Si le jeton est rejeté avant l'heure, il est supprimé et l'envoi suivant en récupère un nouveau.
- Les destinataires sont envoyés un par un à dessein : Bandwidth traite plusieurs numéros dans une même requête comme une conversation de groupe, où chacun voit les réponses des autres.
