# Amazon SNS

<p class="lead">Envoyez des SMS depuis votre compte AWS avec SNS. Idéal si votre application tourne déjà sur AWS et que vous voulez centraliser la facturation.</p>

| | |
|---|---|
| Clé du driver | `aws_sns` |
| Couverture | Monde |
| Envoi | Via le SDK AWS, un destinataire à la fois. |
| Modèles | Non, texte uniquement |
| Webhooks de livraison | Non |
| Site web | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## Installation {#install}

Ce driver a besoin du SDK AWS :

```bash
composer require aws/aws-sdk-php
```

## Configuration {#configure}

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SNS_SENDER_ID=
AWS_SNS_SMS_TYPE=
```

| Variable | |
|---|---|
| `AWS_DEFAULT_REGION` | Région d'envoi, par exemple `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Facultatif. Omettez-la pour utiliser la chaîne d'identifiants par défaut |
| `AWS_SECRET_ACCESS_KEY` | Facultatif, avec la clé ci-dessus |
| `AWS_SNS_SENDER_ID` | Identifiant d'expéditeur alphanumérique facultatif |
| `AWS_SNS_SMS_TYPE` | `Transactional` (par défaut) ou `Promotional` |

Vérifiez la configuration avec un vrai message :

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## Envoyer {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bon à savoir {#good-to-know}

- Sur EC2, ECS, Lambda ou Vapor, laissez les clés d'accès vides : le SDK utilise alors le rôle de l'instance ou de la tâche. Aucune clé à longue durée de vie ne traîne ainsi dans votre `.env`.
- Les nouveaux comptes AWS démarrent dans la sandbox SMS et ne peuvent écrire qu'à des numéros vérifiés. Demandez l'accès production dans la console SNS avant la mise en ligne.
- En coulisses, SNS envoie les SMS via AWS End User Messaging : les plafonds de dépenses, les numéros d'origine et les identifiants d'expéditeur se gèrent donc dans cette console.
