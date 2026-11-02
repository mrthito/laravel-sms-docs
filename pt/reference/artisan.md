# Comandos Artisan

## sms:test {#sms-test}

Envia uma mensagem de verdade para conferir as suas credenciais, pelo mesmo caminho de código que a sua aplicação usa.

```bash
php artisan sms:test {to} [--provider=] [--message=]
```

| | |
|---|---|
| `to` | Destinatário, de preferência no formato E.164: `+15551234567` |
| `--provider` | Chave do provedor a usar. O padrão é o `SMS_PROVIDER`. |
| `--message` | Texto a enviar. O padrão é uma mensagem de teste curta. |

```bash
php artisan sms:test +15551234567 --provider=sinch --message="Hello from production"
```

Quando dá certo, ele mostra o provedor e o ID da mensagem. Quando falha, mostra o motivo informado pelo provedor e termina com status diferente de zero, então você pode usá-lo em scripts de deploy e health checks.

::: warning Ele envia uma mensagem de verdade
E o seu provedor cobra por ela. Use o seu próprio número.
:::

## about {#about}

O comando `php artisan about` do Laravel inclui uma seção **Laravel SMS**:

```text
  Laravel SMS ............................................................
  Default provider ................................................. twilio
  Queue .......................................................... disabled
  Webhooks ........................................................ enabled
```
