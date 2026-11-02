# Eventos

<p class="lead">Cuatro eventos cubren toda la vida de un mensaje. Úsalos para registros de auditoría, analítica, listas de bajas o para frenar un mensaje en el último momento.</p>

| Evento | Se dispara | Propiedades |
|---|---|---|
| `SmsSending` | Antes de llamar al proveedor | `message`, `provider` |
| `SmsSent` | Cuando el proveedor ha aceptado el mensaje | `message`, `provider`, `result` |
| `SmsFailed` | Cuando un envío ha fallado (la excepción se sigue lanzando) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | Cuando llega un webhook verificado del proveedor | `provider`, `payload`, `messageId`, `status`, `recipient` |

Los cuatro están en el namespace `MrRijal\LaravelSms\Events`. `provider` es el nombre con el que se envió el mensaje. Con `random` es el proveedor que se eligió, por ejemplo `twilio`; con `failover` es `failover`.

## Escribir un listener {#writing-a-listener}

Desde Laravel 11, los listeners se registran solos. Genera uno, indica el tipo del evento en `handle()` y Laravel se encarga del resto: sin service provider y sin array `$listen`.

```bash
php artisan make:listener RecordSentSms --event="MrRijal\LaravelSms\Events\SmsSent"
```

```php
namespace App\Listeners;

use App\Models\SmsLog;
use MrRijal\LaravelSms\Events\SmsSent;

class RecordSentSms
{
    public function handle(SmsSent $event): void
    {
        foreach ($event->result->messages as $sent) {
            SmsLog::create([
                'provider' => $event->provider,
                'to' => $sent->to,
                'provider_id' => $sent->id,
                'status' => $sent->status,
            ]);
        }
    }
}
```

Laravel recorre `app/Listeners`, encuentra `handle(SmsSent $event)` y registra el listener para ese evento. Para ver qué ha encontrado:

```bash
php artisan event:list --event=SmsSent
```

En producción, `php artisan optimize` guarda en caché los listeners descubiertos junto con tu configuración y tus rutas.

::: tip Los listeners no pueden provocar envíos duplicados
Cuando se dispara `SmsSent`, el proveedor ya tiene el mensaje. Si uno de tus listeners lanza una excepción, esta va a tu manejador de errores y el envío sigue contando como correcto. Así, un job en cola nunca vuelve a enviar el mismo texto solo porque falló la escritura en un log de auditoría.
:::

### Un listener para varios eventos {#one-listener-several-events}

Los union types también funcionan. Este listener gestiona los dos resultados:

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### Listeners en cola {#queued-listeners}

Escribir en una base de datos o llamar a una API de analítica no debería ralentizar un envío. Implementa `ShouldQueue` y el listener se ejecutará en tu cola:

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class RecordSentSms implements ShouldQueue
{
    public function handle(SmsSent $event): void
    {
        // …
    }
}
```

En Laravel 13 puedes elegir la cola con un atributo:

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## Cancelar un envío {#cancelling-a-send}

Si un listener de `SmsSending` devuelve `false`, el mensaje no se envía. En ese caso, `sendNow()` devuelve `null`.

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // Quien respondió STOP no vuelve a saber de nosotros.
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

Devuelve `null` (o nada) para dejar pasar el mensaje. Solo un `false` explícito lo cancela.

::: warning Este listener tiene que ser síncrono
Un listener que cancela no debe implementar `ShouldQueue`. Un listener en cola se ejecuta cuando el mensaje ya ha salido, así que ya no queda nada que cancelar.
:::

El listener ve el mensaje completo: `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()` y `getProvider()`.

## Reaccionar a los fallos {#reacting-to-failures}

```php
namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use MrRijal\LaravelSms\Events\SmsFailed;

class AlertOnSmsFailure
{
    public function handle(SmsFailed $event): void
    {
        Log::warning('SMS failed', [
            'provider' => $event->provider,
            'recipients' => $event->message->getRedactedRecipientsForLogging(),
            'error' => $event->exception->getMessage(),
        ]);
    }
}
```

`getRedactedRecipientsForLogging()` oculta todo salvo los cuatro últimos dígitos (`***4567`), para que tus logs no se llenen de números de teléfono.

El paquete ya escribe una línea de log de nivel `error` por cada envío fallido. Los envíos correctos no se registran: añade un listener de `SmsSent` si los quieres.

## Listeners con closures {#closure-listeners}

Para algo puntual y rápido, también sirve una closure en `AppServiceProvider::boot()`:

```php
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

public function boot(): void
{
    Event::listen(function (SmsSent $event) {
        // …
    });
}
```

Las clases listener son más fáciles de probar y de encolar, así que úsalas para todo lo que vayas a mantener.

## Probar tus listeners {#testing-your-listeners}

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

`Sms::fake()` dispara `SmsSending` y `SmsSent` igual que un envío real, así que también puedes probar los listeners de principio a fin. Consulta [Pruebas](/es/guide/testing).
