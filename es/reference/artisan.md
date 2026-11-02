# Comandos de Artisan

## sms:test {#sms-test}

Envía un mensaje real para comprobar tus credenciales, usando el mismo código que tu aplicación.

```bash
php artisan sms:test {to} [--provider=] [--message=]
```

| | |
|---|---|
| `to` | Destinatario, idealmente en formato E.164: `+15551234567` |
| `--provider` | Clave del proveedor que se usará. Por defecto, `SMS_PROVIDER`. |
| `--message` | Texto que se enviará. Por defecto, un mensaje de prueba corto. |

```bash
php artisan sms:test +15551234567 --provider=sinch --message="Hello from production"
```

Si todo va bien, muestra el proveedor y el ID del mensaje. Si falla, muestra el motivo que dio el proveedor y termina con un código de salida distinto de cero, así que puedes usarlo en scripts de despliegue y health checks.

::: warning Envía un mensaje real
Y tu proveedor te lo cobra. Usa tu propio número.
:::

## about {#about}

El comando `php artisan about` de Laravel incluye una sección **Laravel SMS**:

```text
  Laravel SMS ............................................................
  Default provider ................................................. twilio
  Queue .......................................................... disabled
  Webhooks ........................................................ enabled
```
