# Drivers propios

<p class="lead">Si tu proveedor no viene incluido, un driver es una sola clase pequeña. La clase base se ocupa de los timeouts, la concurrencia, los fallos parciales y los mensajes de error seguros, así que tú solo describes la API del proveedor.</p>

## Un driver completo {#a-complete-driver}

Este es un driver para un proveedor ficticio, Acme, que acepta un destinatario por petición:

```php
namespace App\Sms;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use MrRijal\LaravelSms\Drivers\HttpDriver;
use MrRijal\LaravelSms\SentMessage;
use MrRijal\LaravelSms\SmsMessage;
use MrRijal\LaravelSms\SmsResult;

class AcmeDriver extends HttpDriver
{
    protected string $label = 'Acme';

    protected function validateConfig(): void
    {
        $this->require('api_key', 'from');
    }

    public function send(SmsMessage $message): SmsResult
    {
        $text = $this->text($message);

        return $this->sendEach(
            $message,
            fn (PendingRequest $request, string $to) => $request
                ->withToken($this->value('api_key'))
                ->post('https://api.acme.test/v1/messages', [
                    'to' => $to,
                    'from' => $this->sender($message),
                    'text' => $text,
                ]),
            function (Response $response, string $to): SentMessage {
                if (! $response->successful()) {
                    $this->fail($response, 'error.message');
                }

                return new SentMessage($to, $this->jsonString($response, 'id'), 'accepted');
            },
        );
    }
}
```

Regístralo en `config/sms.php`:

```php
'drivers' => [
    // …
    'acme' => App\Sms\AcmeDriver::class,
],

'providers' => [
    // …
    'acme' => [
        'api_key' => env('ACME_API_KEY'),
        'from' => env('ACME_FROM'),
    ],
],
```

Y funciona como cualquier proveedor incluido: `Sms::provider('acme')`, cadenas de failover, colas, `php artisan sms:test --provider=acme`.

## Lo que te da la clase base {#what-the-base-class-gives-you}

| Método | Para qué sirve |
|---|---|
| `require('key', …)` | Fallar de inmediato con «Acme configuration is incomplete» cuando faltan ajustes |
| `value('key')` | Leer un ajuste obligatorio como string sin espacios sobrantes |
| `string('key', $default)` / `bool('key')` | Leer ajustes opcionales |
| `oneOf('key', [...], $default)` | Aceptar solo valores conocidos, como una región |
| `httpsUrl('key', $default)` | Aceptar una URL base solo si usa HTTPS |
| `text($message)` | Obtener el texto, o rechazar con un error claro los mensajes que solo tienen plantilla |
| `sender($message)` | El `from()` del mensaje o, si no lo tiene, el remitente configurado |
| `sendEach(…)` | Una petición por destinatario, en paralelo y con seguimiento de fallos parciales |
| `sendOnce(…)` | Una sola petición para todos los destinatarios, para proveedores con endpoint de envío masivo |
| `fail($response, 'json.path')` | Lanzar una `DeliveryException` con el motivo del proveedor, recortado a 200 caracteres |
| `jsonString($response, 'path')` | Leer un string (o un entero) del cuerpo de la respuesta |
| `cachedToken($clientId, fn () => …)` | Obtener un token OAuth y guardarlo en caché hasta poco antes de que caduque |

Las peticiones que construye la clase base ya llevan timeouts, una cabecera `Accept` de JSON y un `User-Agent`, y aparecen en `Http::fake()` como cualquier otra petición.

## Endpoints de envío masivo {#bulk-endpoints}

Si el proveedor acepta muchos destinatarios en una sola llamada, usa `sendOnce()` y construye tú el resultado:

```php
return $this->sendOnce(
    $message,
    fn (PendingRequest $request) => $request
        ->withToken($this->value('api_key'))
        ->post('https://api.acme.test/v1/batches', [
            'to' => $message->getTo(),
            'text' => $this->text($message),
        ]),
    function (Response $response) use ($message): SmsResult {
        if ($response->status() !== 201) {
            $this->fail($response, 'error');
        }

        return SmsResult::accepted($message->getTo(), $this->jsonString($response, 'batch_id'));
    },
);
```

Si el proveedor informa de cada destinatario por separado, lanza una `DeliveryException` con `failedRecipients` y un resultado `partial` con los que sí aceptó. El [driver de ClickSend](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php) es un buen ejemplo para copiar.

## Registrar en tiempo de ejecución {#registering-at-runtime}

Para drivers que necesitan dependencias del contenedor, registra una factory en un service provider:

```php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

`$config` es la entrada del driver en `sms.providers`. Los drivers registrados así siguen funcionando con Octane, en los workers de cola y con `Sms::fake()`.

## Lo mínimo {#the-minimum}

Cualquier clase que implemente `MrRijal\LaravelSms\Contracts\SmsProvider` es un driver válido. Necesita un solo método:

```php
public function send(SmsMessage $message): SmsResult;
```

Devuelve los destinatarios aceptados y lanza una `DeliveryException` cuando algo falla. Extender `HttpDriver` es opcional, pero te ahorra un montón de casos límite.

## Recibir webhooks {#receiving-webhooks}

Para aceptar informes de entrega en tu driver, implementa `MrRijal\LaravelSms\Contracts\HandlesWebhooks` y usa el trait `VerifiesWebhooks` para comprobar las firmas. A partir de ahí, las peticiones a `/laravel-sms/webhook/acme` llegan a tu método `handleWebhook()`. El [driver de Termii](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php) incluido en el paquete muestra cómo hacerlo.
