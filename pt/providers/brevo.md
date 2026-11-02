# Brevo

<p class="lead">A antiga Sendinblue. Uma boa opção se você já envia e-mail pela Brevo e quer uma conta só para os dois.</p>

| | |
|---|---|
| Chave do driver | `brevo` |
| Cobertura | Global |
| Envio | Uma requisição por destinatário, enviadas [em paralelo](/pt/guide/performance). |
| Templates | Sim |
| Webhooks de entrega | Não |
| Site | [www.brevo.com](https://www.brevo.com) |

## Configuração {#configure}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| Variável | |
|---|---|
| `BREVO_API_KEY` | API key (v3) |
| `BREVO_SMS_SENDER` | Nome do remetente (até 11 caracteres) ou número |
| `BREVO_SMS_TYPE` | `transactional` (padrão) ou `marketing` |

Confira a configuração com uma mensagem de verdade:

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## Envio {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Bom saber {#good-to-know}

- Os templates de SMS da Brevo são suportados: passe o ID do template e os parâmetros dele com `->template('12', ['code' => 4821])`.
- Mensagens de marketing precisam incluir uma opção de descadastro (opt-out) e, em alguns países, estão sujeitas a horários de silêncio. Use `transactional` para códigos e comprovantes.
