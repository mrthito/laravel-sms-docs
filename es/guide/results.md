# Resultados y errores

<p class="lead">Un mensaje de texto solo sirve si llega. Cada envío te dice qué aceptó el proveedor y, cuando algo sale mal, exactamente a qué destinatarios afectó.</p>

## El resultado {#the-result}

`sendNow()` devuelve un `SmsResult`:

```php
$result = Sms::to(['+15551234567', '+15557654321'])
    ->message('Hi')
    ->sendNow();

$result->provider;      // "twilio"
$result->recipients();  // ["+15551234567", "+15557654321"]
$result->ids();         // ["SM1a…", "SM2b…"]
$result->firstId();     // "SM1a…"
count($result);         // 2

foreach ($result->messages as $sent) {
    $sent->to;      // "+15551234567"
    $sent->id;      // "SM1a…"
    $sent->status;  // "queued", tal como lo informó el proveedor
}
```

Guarda el ID del mensaje. Es la clave para los informes de entrega del proveedor, para los tickets de soporte («¿dónde está el mensaje SM1a…?») y para relacionar los [webhooks](/es/guide/webhooks) con el mensaje que los generó.

::: info Aceptado no significa entregado
Un resultado significa que el proveedor **aceptó** el mensaje. La entrega al teléfono ocurre unos segundos después y todavía puede fallar si el teléfono está apagado o el número ha cambiado de dueño. Usa [webhooks](/es/guide/webhooks) para seguir la entrega final.
:::

`sendNow()` devuelve `null` en un único caso: cuando un [listener de `SmsSending`](/es/guide/events#cancelling-a-send) canceló el envío. `send()` también devuelve `null` cuando encoló el mensaje en lugar de enviarlo.

## Cuando el proveedor dice que no {#when-a-provider-says-no}

Si el envío se rechaza o el proveedor no responde, se lanza una `DeliveryException`. Su mensaje está pensado para que lo lea una persona y es seguro guardarlo en los logs:

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

Incluye la explicación del propio proveedor, recortada a 200 caracteres. Tus credenciales, nunca.

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400, el código HTTP cuando lo hay
    $e->failedRecipients;       // números que el proveedor no aceptó
    $e->partial?->recipients(); // números que sí aceptó antes de fallar
}
```

## Fallos parciales {#partial-failures}

Si envías a cien personas, puede que un número no sea válido. El paquete no finge que falló todo el envío, ni esconde el que sí falló:

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 99 personas ya tienen el mensaje. No se lo vuelvas a enviar.
        $delivered = $e->partial->recipients();
    }

    // Reintenta, marca o reporta solo estos.
    $e->failedRecipients;
}
```

El mensaje de la excepción también dice cuántos fallaron: `… (1 of 100 recipients failed)`.

Esto es también lo que hace seguro el [failover](/es/guide/failover): el siguiente proveedor solo recibe `failedRecipients`.

## Todas las excepciones del paquete {#every-exception-the-package-throws}

Todas implementan `MrRijal\LaravelSms\Exceptions\SmsException`, así que con un solo `catch` cubres el paquete entero:

| Excepción | Extiende | Se lanza cuando |
|---|---|---|
| `DeliveryException` | `RuntimeException` | Un proveedor rechazó el mensaje, no se pudo contactar con él o falló la autenticación |
| `InvalidMessageException` | `InvalidArgumentException` | Un número está mal formado, el texto está vacío o es demasiado largo, o el proveedor no puede enviar ese tipo de mensaje |
| `InvalidConfigurationException` | `InvalidArgumentException` | Un proveedor no existe, o faltan sus credenciales o ajustes o no son válidos |

Los mensajes y la configuración no válidos fallan **antes** de enviar nada, así que nunca pagas por medio error.
