# Log

<p class="lead">El driver predeterminado. Escribe cada mensaje en el log de Laravel en lugar de enviarlo, así que puedes construir y probar a mano las funciones de SMS sin cuenta en ningún proveedor ni teléfono real.</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # opcional: un canal dedicado de config/logging.php
```

Cada mensaje se convierte en una entrada de nivel `debug`:

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

Los destinatarios aparecen enmascarados, pero el texto del mensaje se guarda completo para que puedas leer tus códigos mientras desarrollas. Por eso mismo, el driver de log **nunca debe usarse en producción**: los códigos de inicio de sesión acabarían en tus archivos de log.

`sendNow()` devuelve un `SmsResult` con un ID de mensaje generado `log-…`, así que el código que guarda IDs funciona sin cambios.
