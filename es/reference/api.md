# API

<p class="lead">Las clases y los métodos públicos que vas a usar a diario, en una sola página.</p>

## Facade Sms {#sms-facade}

`MrRijal\LaravelSms\Facades\Sms` delega en el `SmsManager`.

| Método | Devuelve | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | Empieza un mensaje para estos números |
| `provider(string $name)` | `PendingSms` | Empieza un mensaje con un proveedor concreto |
| `message(string $text)` | `PendingSms` | Empieza un mensaje con este texto |
| `template(string $id, array $vars = [])` | `PendingSms` | Empieza un mensaje con plantilla |
| `compose(?SmsMessage $message = null)` | `PendingSms` | Envuelve un mensaje existente en un builder |
| `send(SmsMessage $message)` | `?SmsResult` | Envía, o encola si `sms.queue` está activado |
| `sendNow(SmsMessage $message)` | `?SmsResult` | Envía de inmediato |
| `queue(SmsMessage $message, $delay = null)` | `void` | Encola un job por destinatario |
| `driver(?string $name = null)` | `SmsProvider` | La instancia del driver de un proveedor |
| `extend(string $name, Closure $factory)` | `SmsManager` | Registra un driver propio |
| `getDefaultDriver()` | `string` | La clave del proveedor predeterminado |
| `forgetDrivers()` | `SmsManager` | Descarta las instancias de drivers en caché |
| `macro(string $name, callable $macro)` | `void` | Añade tu propio método |
| `fake()` | `SmsFake` | Sustituye el manager por un fake que registra los envíos |

## PendingSms {#pendingsms}

Lo devuelve la facade; todos los métodos, salvo los cuatro verbos, devuelven el builder.

| Método | |
|---|---|
| `to(string\|iterable $numbers)` | Añade destinatarios |
| `message(string $text)` / `content(string $text)` | Define el texto |
| `template(string $id, array $vars = [])` | Usa una plantilla del proveedor |
| `from(?string $sender)` | Sustituye al remitente |
| `provider(string $name)` | Elige el proveedor |
| `when($condition, $callback)` / `unless(…)` | Aplica cambios de forma condicional |
| `getMessage()` | El `SmsMessage` subyacente |
| `send()` → `?SmsResult` | Envía, o encola si `sms.queue` está activado |
| `sendNow()` → `?SmsResult` | Envía de inmediato |
| `sendLater()` | Encola |
| `sendLaterAt($when)` / `later($when)` | Encola con un retraso: una fecha, un intervalo o segundos |

## SmsMessage {#smsmessage}

`MrRijal\LaravelSms\SmsMessage` contiene un mensaje. Los setters devuelven el propio mensaje, así que se pueden encadenar.

| Método | |
|---|---|
| `SmsMessage::create(?string $text = null)` | Mensaje nuevo, con texto opcional |
| `to()`, `message()`, `content()`, `template()`, `from()`, `provider()` | Igual que en `PendingSms` |
| `getTo()` → `list<string>` | Destinatarios normalizados |
| `getText()`, `getTemplateId()`, `getFrom()`, `getProvider()` → `?string` | |
| `getVariables()` → `array` | Variables de la plantilla |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | Una copia dirigida a otros números |
| `getRedactedRecipientsForLogging()` → `list<string>` | Números enmascarados como `***4567` |
| `validate()` | Lanza `InvalidMessageException` si no se puede enviar |

## SmsResult {#smsresult}

| Miembro | |
|---|---|
| `$provider` | Clave del proveedor por el que salió el mensaje |
| `$messages` | `list<SentMessage>`, uno por cada destinatario aceptado |
| `recipients()` → `list<string>` | Números aceptados |
| `ids()` → `list<string>` | IDs de mensaje del proveedor, sin repetir |
| `firstId()` → `?string` | El primer ID de mensaje |
| `count()` | Número de destinatarios aceptados |

`SentMessage` tiene tres propiedades de solo lectura: `$to`, `$id` y `$status`.

## Excepciones {#exceptions}

Todas están en `MrRijal\LaravelSms\Exceptions` y todas implementan `SmsException`.

| Clase | Miembros |
|---|---|
| `DeliveryException` | `$provider`, `$failedRecipients`, `$partial` (`?SmsResult`), `hasPartialDelivery()`, `getCode()` (el código HTTP) |
| `InvalidMessageException` | Número mal formado, texto vacío o demasiado largo, tipo de mensaje no admitido |
| `InvalidConfigurationException` | Proveedor desconocido, ajustes que faltan o no son válidos |

## Contratos {#contracts}

| Interfaz | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult`: impleméntala para escribir un driver |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response`: recibe los webhooks del proveedor |
| `Contracts\Factory` | Vinculada al manager; úsala como type-hint para la inyección de dependencias |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
