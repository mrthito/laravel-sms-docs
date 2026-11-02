# WhatsApp

<p class="lead">Envoyez des messages WhatsApp via la Cloud API de Meta, avec la même API que pour vos SMS. Prend en charge le texte libre et les modèles approuvés.</p>

| | |
|---|---|
| Clé du driver | `whatsapp` |
| Couverture | Monde |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Oui |
| Webhooks de livraison | Oui |
| Site web | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| Variable | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID, depuis WhatsApp Manager |
| `WHATSAPP_ACCESS_TOKEN` | Un jeton d'accès permanent d'utilisateur système |
| `WHATSAPP_API_VERSION` | Facultatif, `v21.0` par défaut |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Facultatif, `en` par défaut. Code de langue de vos modèles, par exemple `en_US` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | Facultatif. Ajouté aux numéros écrits sans indicatif pays |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- WhatsApp n'autorise le texte libre que dans les 24 heures qui suivent le dernier message du client. Pour ouvrir une conversation, envoyez un modèle approuvé : `->template('order_update', ['Ana', '#4821'])`. Les variables remplissent dans l'ordre les paramètres du corps du modèle.
- Utilisez un jeton d'utilisateur système, et non le jeton temporaire de la page de démarrage, qui expire au bout d'un jour.

## Accusés de réception {#delivery-reports}

Faites pointer l'URL des accusés de réception de WhatsApp vers `https://your-app.com/laravel-sms/webhook/whatsapp` et activez les [webhooks](/fr/guide/webhooks). Les requêtes sont vérifiées par un HMAC `X-Hub-Signature-256` (`WHATSAPP_WEBHOOK_SECRET`), et la vérification d'abonnement de Meta utilise `WHATSAPP_VERIFY_TOKEN`.

Chaque accusé de réception vérifié déclenche l'événement `SmsWebhookReceived`.
