# Termii

<p class="lead">Une plateforme nigériane populaire, avec des routes conformes au DND et l'envoi WhatsApp depuis le même compte.</p>

| | |
|---|---|
| Clé du driver | `termii` |
| Couverture | Nigeria et Afrique |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Oui |
| Site web | [termii.com](https://termii.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| Variable | |
|---|---|
| `TERMII_API_KEY` | Clé d'API |
| `TERMII_SENDER_ID` | Identifiant d'expéditeur approuvé |
| `TERMII_CHANNEL` | `generic` (par défaut), `dnd` pour les numéros inscrits au Do-Not-Disturb, ou `whatsapp` |
| `TERMII_BASE_URL` | Facultatif. L'URL de base de votre compte, depuis le tableau de bord Termii, HTTPS uniquement |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +2348012345678 --provider=termii
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Utilisez le canal `dnd` pour les messages transactionnels comme les codes à usage unique (OTP). Au Nigeria, la route `generic` n'atteint pas les numéros inscrits au Do-Not-Disturb.
- Termii s'authentifie avec la clé d'API placée dans le corps de la requête ; le driver ne l'envoie qu'en HTTPS.

## Accusés de réception {#delivery-reports}

Faites pointer l'URL des accusés de réception de Termii vers `https://your-app.com/laravel-sms/webhook/termii` et activez les [webhooks](/fr/guide/webhooks). Les requêtes sont vérifiées par un HMAC-SHA512 dans `X-Termii-Signature`, à l'aide de `TERMII_WEBHOOK_SECRET`.

Chaque accusé de réception vérifié déclenche l'événement `SmsWebhookReceived`.
