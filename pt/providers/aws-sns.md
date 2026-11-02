# Amazon SNS

<p class="lead">Envie SMS pela sua conta da AWS com o SNS. Ideal se a sua aplicação já roda na AWS e você quer a cobrança toda em um lugar só.</p>

| | |
|---|---|
| Chave do driver | `aws_sns` |
| Cobertura | Global |
| Envio | Pelo SDK da AWS, um destinatário por vez. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## Instalação {#install}

Este driver precisa do SDK da AWS:

```bash
composer require aws/aws-sdk-php
```

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SNS_SENDER_ID=
AWS_SNS_SMS_TYPE=
```

| Variável | |
|---|---|
| `AWS_DEFAULT_REGION` | Região de onde enviar, como `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Opcional. Omita para usar a cadeia de credenciais padrão |
| `AWS_SECRET_ACCESS_KEY` | Opcional, junto com a chave acima |
| `AWS_SNS_SENDER_ID` | Sender ID alfanumérico opcional |
| `AWS_SNS_SMS_TYPE` | `Transactional` (padrão) ou `Promotional` |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- No EC2, ECS, Lambda ou Vapor, deixe as access keys vazias e o SDK usa a role da instância ou da task. Assim nenhuma chave de longa duração fica parada no seu `.env`.
- Contas novas da AWS começam no sandbox de SMS e só podem enviar para números verificados. Peça acesso de produção no console do SNS antes de entrar no ar.
- Por baixo dos panos, o SNS envia SMS pelo AWS End User Messaging, então limites de gasto, números de origem e sender IDs são gerenciados naquele console.
