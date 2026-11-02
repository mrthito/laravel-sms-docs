# Clickatell

<p class="lead">Une passerelle de longue date, avec une couverture étendue en Afrique et sur les marchés émergents. Utilise la Clickatell One API.</p>

| | |
|---|---|
| Clé du driver | `clickatell` |
| Couverture | Monde |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.clickatell.com](https://www.clickatell.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| Variable | |
|---|---|
| `CLICKATELL_API_KEY` | Clé d'API d'une intégration One API |
| `CLICKATELL_FROM` | Expéditeur facultatif, si votre compte en a un d'approuvé |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Clickatell accepte jusqu'à 100 destinataires par requête ; les envois plus importants sont automatiquement découpés en lots.
- Chaque destinataire est accepté ou refusé individuellement, et les refus sont signalés numéro par numéro.
