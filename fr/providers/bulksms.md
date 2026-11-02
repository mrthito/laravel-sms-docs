# BulkSMS

<p class="lead">Une passerelle internationale sans fioritures, qui envoie tous les destinataires en une seule requête JSON.</p>

| | |
|---|---|
| Clé du driver | `bulksms` |
| Couverture | Monde, surtout en Afrique australe |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Oui |
| Site web | [www.bulksms.com](https://www.bulksms.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| Variable | |
|---|---|
| `BULKSMS_TOKEN_ID` | Identifiant du jeton d'API |
| `BULKSMS_TOKEN_SECRET` | Secret du jeton d'API |
| `BULKSMS_FROM` | Expéditeur facultatif, si votre compte en a un |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Créez un jeton dans *Settings → API Tokens* ; le driver l'utilise avec l'authentification HTTP Basic.

## Accusés de réception {#delivery-reports}

Faites pointer l'URL des accusés de réception de BulkSMS vers `https://your-app.com/laravel-sms/webhook/bulksms` et activez les [webhooks](/fr/guide/webhooks). Les requêtes sont vérifiées par un HMAC-SHA256 dans `X-BulkSMS-Signature`, à l'aide de `BULKSMS_WEBHOOK_SECRET`.

Chaque accusé de réception vérifié déclenche l'événement `SmsWebhookReceived`.
