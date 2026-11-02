# Pruebas

<p class="lead">Las pruebas nunca deberían enviar un SMS a un teléfono real. Simula la facade, ejecuta tu código y luego comprueba lo que se habría enviado.</p>

## Simular los envíos {#faking-sends}

```php
use MrRijal\LaravelSms\Facades\Sms;
use MrRijal\LaravelSms\SmsMessage;

it('sends a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567'])->assertOk();

    Sms::assertSentTo('+15551234567');
    Sms::assertSent(fn (SmsMessage $sms) => str_contains($sms->getText(), 'code'));
    Sms::assertSentCount(1);
});

it('stays quiet for unverified numbers', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15550000000']);

    Sms::assertNothingSent();
});
```

`Sms::fake()` funciona en todos los sitios desde los que el paquete envía: la facade, las notificaciones, el trait `HasSms` y los jobs en cola.

## Aserciones disponibles {#available-assertions}

| Aserción | Pasa cuando |
|---|---|
| `assertSent($callback)` | Al menos un mensaje enviado cumple el callback |
| `assertSent($count)` | Se enviaron exactamente `$count` mensajes |
| `assertSentTo($number, $callback = null)` | Se envió un mensaje a `$number`, escrito en cualquier formato |
| `assertNotSent($callback = null)` | Ningún mensaje enviado coincide |
| `assertNothingSent()` | No se envió nada |
| `assertSentCount($count)` | Se enviaron exactamente `$count` mensajes |
| `assertQueued($callback or $count)` | Se encoló un mensaje, o exactamente `$count` (uno por destinatario) |
| `assertNothingQueued()` | No se encoló nada |

Si quieres inspeccionar los mensajes tú mismo, `Sms::sent()` y `Sms::queued()` devuelven colecciones de `SmsMessage`.

## Se comporta como el de verdad {#it-behaves-like-the-real-thing}

El fake no llama a los proveedores, pero hace todo lo demás hasta ese punto:

- Los mensajes se validan, así que un número no válido sigue haciendo fallar tu prueba.
- Se comprueban los nombres de proveedor: `Sms::provider('twillio')` lanza una excepción, igual que en producción.
- Se disparan `SmsSending` y `SmsSent`, así que puedes probar tus listeners, incluido uno que cancele un envío.
- Los drivers registrados con `Sms::extend()` siguen funcionando.
- Cada mensaje se registra tal como estaba en el momento de enviarse, aunque tu código lo modifique después.

## Probar un driver {#testing-a-driver}

Para probar la integración con un proveedor, incluido tu propio [driver personalizado](/es/guide/custom-drivers), simula la capa HTTP. Todos los drivers HTTP usan el cliente HTTP de Laravel, así que `Http::fake()` intercepta sus peticiones:

```php
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

Http::fake([
    'api.twilio.com/*' => Http::response(['sid' => 'SM123', 'status' => 'queued'], 201),
]);

$result = Sms::provider('twilio')->to('+15551234567')->message('Hi')->sendNow();

expect($result->firstId())->toBe('SM123');

Http::assertSent(fn (Request $request) => $request['To'] === '+15551234567');
```

Añade `Http::preventStrayRequests()` para asegurarte de que ninguna petición se escapa a una API real.

::: info Amazon SNS
El driver de SNS usa el SDK de AWS en lugar del cliente HTTP de Laravel, así que `Http::fake()` no le afecta. En su lugar, pásale al driver un `SnsClient` simulado: `new AwsSnsDriver($config, $snsClient)`.
:::
