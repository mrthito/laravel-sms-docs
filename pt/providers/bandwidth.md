# Bandwidth

<p class="lead">Uma operadora americana dona da própria rede, usada por muitas das grandes plataformas de comunicação. Autentica com OAuth 2.0.</p>

| | |
|---|---|
| Chave do driver | `bandwidth` |
| Cobertura | Estados Unidos e Canadá |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.bandwidth.com](https://www.bandwidth.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| Variável | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | Account ID |
| `BANDWIDTH_APPLICATION_ID` | Aplicação de mensagens vinculada ao seu número |
| `BANDWIDTH_CLIENT_ID` | OAuth client ID |
| `BANDWIDTH_CLIENT_SECRET` | OAuth client secret |
| `BANDWIDTH_FROM` | Um número da Bandwidth atribuído a essa aplicação |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- O driver troca o seu client ID e secret por um access token e o guarda em cache por cerca de uma hora. Se o token for recusado antes disso, ele é descartado e o próximo envio busca um novo.
- Os destinatários são enviados um a um de propósito: a Bandwidth trata vários números em uma mesma requisição como uma conversa em grupo, em que todos veem as respostas uns dos outros.
