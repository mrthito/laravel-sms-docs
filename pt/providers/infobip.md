# Infobip

<p class="lead">Uma plataforma corporativa com alcance muito amplo entre operadoras, especialmente forte na Europa, no Oriente Médio e na África. Usa a SMS API v3.</p>

| | |
|---|---|
| Chave do driver | `infobip` |
| Cobertura | Global |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [www.infobip.com](https://www.infobip.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| Variável | |
|---|---|
| `INFOBIP_API_KEY` | API key |
| `INFOBIP_SENDER` | Número remetente ou ID alfanumérico |
| `INFOBIP_BASE_URL` | Sua base URL pessoal do portal da Infobip, como `https://xyz123.api.infobip.com` |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Use a **base URL pessoal** que aparece na página inicial da sua conta na Infobip. A Infobip roteia o seu tráfego por ela, e o suporte vai pedi-la.
- A base URL precisa usar HTTPS; qualquer outra coisa é recusada quando o driver é carregado.
