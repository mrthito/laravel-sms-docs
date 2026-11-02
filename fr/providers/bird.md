# Bird

<p class="lead">L'entreprise anciennement connue sous le nom de MessageBird. Ce driver utilise l'API SMS actuelle de Bird, avec des clés d'API de workspace.</p>

| | |
|---|---|
| Clé du driver | `bird` |
| Couverture | Monde |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [bird.com](https://bird.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| Variable | |
|---|---|
| `BIRD_API_KEY` | Clé d'API du workspace, commence par `bk_` |
| `BIRD_FROM` | Numéro d'expéditeur ou identifiant alphanumérique |
| `BIRD_REGION` | `us1` (par défaut) ou `eu1` ; doit correspondre à votre clé |
| `BIRD_CATEGORY` | `transactional` (par défaut), `marketing`, `authentication` ou `service` |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=bird
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Les clés sont liées à une région : une clé `bk_eu1_…` ne fonctionne qu'avec `BIRD_REGION=eu1`.
- Renseignez `BIRD_CATEGORY` honnêtement. Plusieurs pays appliquent des règles différentes, et des tarifs différents, au trafic marketing.
- Les anciens identifiants `AccessKey` de MessageBird ne sont pas pris en charge ; créez une clé de workspace dans le tableau de bord Bird.
