# Vonage

<p class="lead">Anciennement Nexmo. Une solide couverture internationale et une tarification simple, via la Vonage SMS API.</p>

| | |
|---|---|
| Clé du driver | `vonage` |
| Couverture | Monde |
| Envoi | Une requête par destinataire, envoyées [en parallèle](/fr/guide/performance). |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.vonage.com](https://www.vonage.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| Variable | |
|---|---|
| `VONAGE_KEY` | Clé d'API |
| `VONAGE_SECRET` | Secret d'API |
| `VONAGE_FROM` | Numéro d'expéditeur ou identifiant alphanumérique |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Les messages contenant des caractères hors de l'alphabet GSM, comme des emoji ou du devanagari, sont automatiquement envoyés en Unicode et arrivent donc intacts.
- Vonage répond par un HTTP 200 même lorsqu'il refuse un message. Le driver lit le statut de chaque message : les refus lèvent donc bien une `DeliveryException`, avec la raison donnée par Vonage.
