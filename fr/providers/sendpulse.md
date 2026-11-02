# SendPulse

<p class="lead">Une plateforme de marketing multicanal, populaire en Europe et en Amérique latine. S'authentifie avec OAuth 2.0 et envoie tous les destinataires en une seule requête.</p>

| | |
|---|---|
| Clé du driver | `sendpulse` |
| Couverture | Monde |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [sendpulse.com](https://sendpulse.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| Variable | |
|---|---|
| `SENDPULSE_CLIENT_ID` | ID de l'API REST |
| `SENDPULSE_CLIENT_SECRET` | Secret de l'API REST |
| `SENDPULSE_SENDER` | Nom d'expéditeur approuvé (11 caractères maximum) |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Les jetons d'accès sont mis en cache pendant environ une heure et renouvelés automatiquement.
- Les noms d'expéditeur doivent être approuvés dans le tableau de bord SendPulse avant de pouvoir être utilisés.
