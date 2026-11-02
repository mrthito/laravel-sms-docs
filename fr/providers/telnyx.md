# Telnyx

<p class="lead">Un opérateur pensé pour les développeurs, qui exploite son propre réseau privé, avec des tarifs compétitifs aux États-Unis.</p>

| | |
|---|---|
| Clé du driver | `telnyx` |
| Couverture | Monde |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [telnyx.com](https://telnyx.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| Variable | |
|---|---|
| `TELNYX_API_KEY` | Clé d'API (v2) |
| `TELNYX_FROM` | Numéro d'expéditeur |
| `TELNYX_MESSAGING_PROFILE_ID` | Facultatif. Utilise un messaging profile et son pool de numéros au lieu d'un expéditeur unique |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Il vous faut soit `TELNYX_FROM`, soit `TELNYX_MESSAGING_PROFILE_ID`.
- Les numéros américains doivent être enregistrés pour le 10DLC avant que Telnyx n'achemine du trafic d'application à personne (A2P).
