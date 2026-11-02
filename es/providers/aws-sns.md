# Amazon SNS

<p class="lead">Envía SMS desde tu cuenta de AWS con SNS. Ideal si tu aplicación ya corre en AWS y quieres toda la facturación en un solo sitio.</p>

| | |
|---|---|
| Clave del driver | `aws_sns` |
| Cobertura | Global |
| Envío | A través del SDK de AWS, un destinatario cada vez. |
| Plantillas | No, solo texto |
| Webhooks de entrega | No |
| Sitio web | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## Instalación {#install}

Este driver necesita el SDK de AWS:

```bash
composer require aws/aws-sdk-php
```

## Configuración {#configure}

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
| `AWS_DEFAULT_REGION` | Región desde la que se envía, por ejemplo `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Opcional. Si no la indicas, se usa la cadena de credenciales predeterminada |
| `AWS_SECRET_ACCESS_KEY` | Opcional, junto con la anterior |
| `AWS_SNS_SENDER_ID` | Remitente alfanumérico opcional |
| `AWS_SNS_SMS_TYPE` | `Transactional` (predeterminado) o `Promotional` |

Comprueba la configuración con un mensaje real:

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## Envío {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Conviene saber {#good-to-know}

- En EC2, ECS, Lambda o Vapor deja vacías las access keys y el SDK usará el rol de la instancia o de la tarea. Así no tienes claves de larga duración en tu `.env`.
- Las cuentas nuevas de AWS empiezan en el sandbox de SMS y solo pueden enviar a números verificados. Solicita el acceso de producción en la consola de SNS antes de salir en vivo.
- Por debajo, SNS envía los SMS a través de AWS End User Messaging, así que los límites de gasto, los números de origen y los remitentes se gestionan en esa consola.
