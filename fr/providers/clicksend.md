# ClickSend

<p class="lead">Populaire en Australie, au Royaume-Uni et aux États-Unis, avec un tableau de bord épuré et le statut de chaque message dans chaque réponse.</p>

| | |
|---|---|
| Clé du driver | `clicksend` |
| Couverture | Monde |
| Envoi | Une seule requête pour tous les destinataires. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [www.clicksend.com](https://www.clicksend.com) |

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| Variable | |
|---|---|
| `CLICKSEND_USERNAME` | Votre nom d'utilisateur ClickSend |
| `CLICKSEND_API_KEY` | Clé d'API, depuis le tableau de bord |
| `CLICKSEND_FROM` | Expéditeur facultatif. Laissez vide pour utiliser les numéros partagés de ClickSend |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- ClickSend rend compte de chaque destinataire séparément. Si certains sont refusés, vous obtenez une `DeliveryException` qui liste précisément ces numéros, et un résultat `partial` pour les autres.
