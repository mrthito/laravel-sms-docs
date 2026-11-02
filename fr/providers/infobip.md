# Infobip

<p class="lead">Une plateforme pour les grandes entreprises, connectée à un très grand nombre d'opérateurs, particulièrement solide en Europe, au Moyen-Orient et en Afrique. Utilise la SMS API v3.</p>

| | |
|---|---|
| Clé du driver | `infobip` |
| Couverture | Monde |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.infobip.com](https://www.infobip.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| Variable | |
|---|---|
| `INFOBIP_API_KEY` | Clé d'API |
| `INFOBIP_SENDER` | Numéro d'expéditeur ou identifiant alphanumérique |
| `INFOBIP_BASE_URL` | Votre URL de base personnelle, indiquée sur le portail Infobip, par exemple `https://xyz123.api.infobip.com` |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Utilisez l'**URL de base personnelle** affichée sur la page d'accueil de votre compte Infobip. Infobip y fait transiter votre trafic, et le support vous la demandera.
- L'URL de base doit utiliser HTTPS ; toute autre valeur est rejetée au chargement du driver.
