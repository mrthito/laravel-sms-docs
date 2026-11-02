# Eventos

<p class="lead">Quatro eventos cobrem a vida inteira de uma mensagem. Use-os para trilhas de auditoria, métricas, listas de descadastro (opt-out) ou para barrar uma mensagem no último instante.</p>

| Evento | Disparado | Propriedades |
|---|---|---|
| `SmsSending` | Antes de chamar o provedor | `message`, `provider` |
| `SmsSent` | Depois que o provedor aceitou a mensagem | `message`, `provider`, `result` |
| `SmsFailed` | Depois que um envio falhou (a exceção continua sendo lançada) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | Depois que chega um webhook verificado do provedor | `provider`, `payload`, `messageId`, `status`, `recipient` |

Os quatro ficam no namespace `MrRijal\LaravelSms\Events`. O `provider` é o nome pelo qual a mensagem foi enviada. Com `random`, é o provedor sorteado, como `twilio`; com `failover`, é `failover`.

## Escrevendo um listener

Desde o Laravel 11, os listeners se registram sozinhos. Gere um, declare o tipo do evento no `handle()` e o Laravel faz a ligação: sem service provider e sem array `$listen`.

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

O Laravel varre a pasta `app/Listeners`, encontra o `handle(SmsSent $event)` e registra o listener para esse evento. Para conferir o que ele encontrou:

```bash
php artisan event:list --event=SmsSent
```

Em produção, o `php artisan optimize` coloca em cache os listeners descobertos junto com a sua configuração e as suas rotas.

::: tip Listeners não causam envios duplicados
Quando o `SmsSent` dispara, o provedor já está com a mensagem. Se um dos seus listeners lançar uma exceção, ela vai para o seu error handler e o envio continua contando como bem-sucedido. Assim, um job na fila nunca reenvia o mesmo texto só porque a gravação no log de auditoria falhou.
:::

### Um listener, vários eventos

Union types também funcionam. Este listener trata os dois desfechos:

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### Listeners na fila

Gravar no banco de dados ou chamar uma API de métricas não deveria deixar o envio mais lento. Implemente `ShouldQueue` e o listener roda na sua fila:

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

No Laravel 13, você pode escolher a fila com um atributo:

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## Cancelando um envio

Devolva `false` em um listener de `SmsSending` e a mensagem não é enviada. Nesse caso, o `sendNow()` devolve `null`.

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // Quem respondeu STOP não recebe mais nada da gente.
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

Devolva `null` (ou nada) para deixar a mensagem passar. Só um `false` explícito cancela.

::: warning Mantenha este listener síncrono
Um listener que cancela envios não pode implementar `ShouldQueue`. Um listener na fila roda depois que a mensagem já saiu, então não sobra nada para cancelar.
:::

O listener enxerga a mensagem completa: `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()` e `getProvider()`.

## Reagindo a falhas

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

O `getRedactedRecipientsForLogging()` mascara tudo menos os quatro últimos dígitos (`***4567`), assim seus logs não ficam cheios de números de telefone.

O pacote já grava uma linha de log `error` para cada envio que falha. Envios bem-sucedidos não vão para o log: adicione um listener de `SmsSent` se quiser registrá-los.

## Listeners com closure

Para algo rápido e pontual, uma closure no `AppServiceProvider::boot()` também resolve:

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

Classes de listener são mais fáceis de testar e de colocar na fila, então prefira-as para tudo o que for ficar no projeto.

## Testando seus listeners

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

O `Sms::fake()` dispara o `SmsSending` e o `SmsSent` como um envio de verdade, então você também pode testar os listeners de ponta a ponta. Veja [Testes](/pt/guide/testing).
