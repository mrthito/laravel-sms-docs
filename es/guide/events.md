# Eventos

<p class="lead">Cuatro eventos cubren toda la vida de un mensaje. Úsalos para registros de auditoría, analítica, límites de envío o para frenar un mensaje en el último momento.</p>

| Evento | Se dispara | Propiedades |
|---|---|---|
| `SmsSending` | Antes de llamar al proveedor | `message`, `provider` |
| `SmsSent` | Cuando el proveedor ha aceptado el mensaje | `message`, `provider`, `result` |
| `SmsFailed` | Cuando un envío ha fallado (la excepción se sigue lanzando) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | Cuando llega un webhook verificado del proveedor | `provider`, `payload`, `messageId`, `status`, `recipient` |

Los cuatro están en el namespace `MrRijal\LaravelSms\Events`. `provider` es el nombre con el que se envió el mensaje. Con `random` es el proveedor que se eligió, por ejemplo `twilio`; con `failover` es `failover`.

## Llevar un registro de auditoría {#keeping-an-audit-trail}

```php
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

Event::listen(function (SmsSent $event) {
    foreach ($event->result->messages as $sent) {
        SmsLog::create([
            'provider' => $event->provider,
            'to' => $sent->to,
            'provider_id' => $sent->id,
            'status' => $sent->status,
        ]);
    }
});
```

::: tip Los listeners no pueden provocar envíos duplicados
Cuando se dispara `SmsSent`, el proveedor ya tiene el mensaje. Si uno de tus listeners lanza una excepción, esta va a tu manejador de errores y el envío sigue contando como correcto. Así, un job en cola nunca vuelve a enviar el mismo texto solo porque falló la escritura en un log de auditoría.
:::

## Cancelar un envío {#cancelling-a-send}

Si un listener de `SmsSending` devuelve `false`, el mensaje no se envía. En ese caso, `sendNow()` devuelve `null`.

```php
use MrRijal\LaravelSms\Events\SmsSending;

Event::listen(function (SmsSending $event) {
    // Respeta a quien respondió STOP.
    foreach ($event->message->getTo() as $number) {
        if (OptOut::where('phone', $number)->exists()) {
            return false;
        }
    }
});
```

El listener ve el mensaje completo: `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()` y `getProvider()`.

## Reaccionar a los fallos {#reacting-to-failures}

```php
use MrRijal\LaravelSms\Events\SmsFailed;

Event::listen(function (SmsFailed $event) {
    Log::warning('SMS failed', [
        'provider' => $event->provider,
        'recipients' => $event->message->getRedactedRecipientsForLogging(),
        'error' => $event->exception->getMessage(),
    ]);
});
```

`getRedactedRecipientsForLogging()` oculta todo salvo los cuatro últimos dígitos (`***4567`), para que tus logs no se llenen de números de teléfono.

El paquete ya escribe una línea de log de nivel `error` por cada envío fallido. Los envíos correctos no se registran: escucha `SmsSent` si los quieres.
