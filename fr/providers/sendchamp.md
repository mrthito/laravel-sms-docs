# Sendchamp

<p class="lead">Une plateforme de communication nigériane, avec des routes DND, non DND et internationales. Envoie tous les destinataires en une seule requête.</p>

| | |
|---|---|
| Clé du driver | `sendchamp` |
| Couverture | Nigeria et Afrique |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Oui |
| Site web | [sendchamp.com](https://sendchamp.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| Variable | |
|---|---|
| `SENDCHAMP_API_KEY` | Clé d'accès publique |
| `SENDCHAMP_SENDER_NAME` | Nom d'expéditeur approuvé |
| `SENDCHAMP_ROUTE` | `dnd` (par défaut), `non_dnd` ou `international` |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Réservez la route `dnd` à tout ce qui est urgent, comme les codes de connexion : elle atteint les numéros inscrits au Do-Not-Disturb.

## Accusés de réception {#delivery-reports}

Faites pointer l'URL des accusés de réception de Sendchamp vers `https://your-app.com/laravel-sms/webhook/sendchamp` et activez les [webhooks](/fr/guide/webhooks). Les requêtes sont vérifiées par un HMAC-SHA256 dans `X-Sendchamp-Signature`, à l'aide de `SENDCHAMP_WEBHOOK_SECRET`.

Chaque accusé de réception vérifié déclenche l'événement `SmsWebhookReceived`.
