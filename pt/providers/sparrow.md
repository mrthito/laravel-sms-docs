# Sparrow SMS

<p class="lead">O gateway de SMS mais usado no Nepal, com rotas diretas para a NTC e a Ncell.</p>

| | |
|---|---|
| Chave do driver | `sparrow` |
| Cobertura | Nepal |
| Envio | Uma única requisição para todos os destinatários. |
| Templates | Não, só texto |
| Webhooks de entrega | Não |
| Site | [sparrowsms.com](https://sparrowsms.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| Variável | |
|---|---|
| `SPARROW_TOKEN` | API token |
| `SPARROW_FROM` | Sua identidade aprovada (remetente) |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +9779812345678 --provider=sparrow
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+9779812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Todos os destinatários são enviados em uma única requisição.
- Escreva os números nepaleses com o código do país (`+97798…`) ou como celulares locais de dez dígitos (`98…`); os dois formatos são aceitos.
