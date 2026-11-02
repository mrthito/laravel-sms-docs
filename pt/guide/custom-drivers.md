# Drivers próprios

<p class="lead">Se o seu provedor não vem embutido, um driver é uma classe pequena. A classe base cuida de timeouts, concorrência, falhas parciais e mensagens de erro seguras, então você só descreve a API do provedor.</p>

## Um driver completo

Aqui está um driver para um provedor fictício, a Acme, que aceita um destinatário por requisição:

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

Registre-o no `config/sms.php`:

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

E ele funciona como qualquer provedor embutido: `Sms::provider('acme')`, cadeias de failover, filas, `php artisan sms:test --provider=acme`.

## O que a classe base oferece

| Método | Use para |
|---|---|
| `require('key', …)` | Falhar logo de cara com "Acme configuration is incomplete" quando faltam configurações |
| `value('key')` | Ler uma configuração obrigatória como string, já com trim |
| `string('key', $default)` / `bool('key')` | Ler configurações opcionais |
| `oneOf('key', [...], $default)` | Aceitar só valores conhecidos, como uma região |
| `httpsUrl('key', $default)` | Aceitar uma URL base só se ela usar HTTPS |
| `text($message)` | Obter o texto, ou recusar mensagens só com template com um erro claro |
| `sender($message)` | O `from()` da mensagem, caindo para o remetente configurado |
| `sendEach(…)` | Uma requisição por destinatário, executadas em paralelo, com controle de falhas parciais |
| `sendOnce(…)` | Uma requisição para todos os destinatários, para provedores com endpoint de envio em massa |
| `fail($response, 'json.path')` | Lançar uma `DeliveryException` com o motivo do provedor, cortado em 200 caracteres |
| `jsonString($response, 'path')` | Ler uma string (ou um inteiro) do corpo da resposta |
| `cachedToken($clientId, fn () => …)` | Buscar um token OAuth e guardá-lo em cache até pouco antes de expirar |

As requisições montadas pela classe base já vêm com timeouts, um header `Accept` JSON e um `User-Agent`, e aparecem no `Http::fake()` como qualquer outra requisição.

## Endpoints de envio em massa

Se o provedor aceita vários destinatários em uma única chamada, use o `sendOnce()` e monte o resultado você mesmo:

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

Se o provedor informa cada destinatário separadamente, lance uma `DeliveryException` com `failedRecipients` e um resultado `partial` para os que ele aceitou. O [driver da ClickSend](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php) é um bom exemplo para copiar.

## Registrando em tempo de execução

Para drivers que precisam de dependências do container, registre uma factory no `AppServiceProvider`:

```php
// app/Providers/AppServiceProvider.php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

O `$config` é a entrada do driver em `sms.providers`. Drivers registrados desse jeito continuam funcionando no Octane, nos workers de fila e com o `Sms::fake()`.

## O mínimo

Qualquer classe que implemente `MrRijal\LaravelSms\Contracts\SmsProvider` é um driver válido. Ela precisa de um único método:

```php
public function send(SmsMessage $message): SmsResult;
```

Devolva os destinatários aceitos e lance uma `DeliveryException` nas falhas. Estender o `HttpDriver` é opcional, mas poupa você de muitos casos de borda.

## Recebendo webhooks

Para aceitar relatórios de entrega no seu driver, implemente `MrRijal\LaravelSms\Contracts\HandlesWebhooks` e use a trait `VerifiesWebhooks` para verificar as assinaturas. Com isso, as requisições para `/laravel-sms/webhook/acme` são direcionadas para o seu método `handleWebhook()`. O [driver da Termii](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php) embutido mostra o padrão.
