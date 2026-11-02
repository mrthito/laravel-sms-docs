# Brevo

<p class="lead">Anciennement Sendinblue. Un bon choix si vous envoyez déjà vos e-mails via Brevo et souhaitez un seul compte pour les deux.</p>

| | |
|---|---|
| Clé du driver | `brevo` |
| Couverture | Monde |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Oui |
| Webhooks de livraison | Non |
| Site web | [www.brevo.com](https://www.brevo.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| Variable | |
|---|---|
| `BREVO_API_KEY` | Clé d'API (v3) |
| `BREVO_SMS_SENDER` | Nom d'expéditeur (11 caractères maximum) ou numéro |
| `BREVO_SMS_TYPE` | `transactional` (par défaut) ou `marketing` |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Les modèles SMS de Brevo sont pris en charge : passez l'identifiant du modèle et ses paramètres avec `->template('12', ['code' => 4821])`.
- Les messages marketing doivent proposer un moyen de désinscription et, dans certains pays, respecter des plages horaires d'envoi restreintes. Utilisez `transactional` pour les codes et les reçus.
