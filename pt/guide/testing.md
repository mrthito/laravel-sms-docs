# Testes

<p class="lead">Teste nenhum deveria mandar SMS para um celular de verdade. Faça um fake da facade, rode o seu código e depois verifique o que teria sido enviado.</p>

## Simulando envios

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

O `Sms::fake()` funciona em todos os lugares em que o pacote envia: a facade, as notificações, a trait `HasSms` e os jobs na fila.

## Asserções disponíveis

| Asserção | Passa quando |
|---|---|
| `assertSent($callback)` | Pelo menos uma mensagem enviada bate com o callback |
| `assertSent($count)` | Exatamente `$count` mensagens foram enviadas |
| `assertSentTo($number, $callback = null)` | Uma mensagem foi para `$number`, escrito em qualquer formato |
| `assertNotSent($callback = null)` | Nenhuma mensagem enviada bate |
| `assertNothingSent()` | Nada foi enviado |
| `assertSentCount($count)` | Exatamente `$count` mensagens foram enviadas |
| `assertQueued($callback or $count)` | Uma mensagem foi para a fila, ou exatamente `$count` foram (uma por destinatário) |
| `assertNothingQueued()` | Nada foi para a fila |

Para inspecionar as mensagens você mesmo, `Sms::sent()` e `Sms::queued()` devolvem collections de `SmsMessage`.

## Ele se comporta como o de verdade

O fake não chama os provedores, mas faz tudo o que vem antes disso:

- As mensagens são validadas, então um número inválido continua quebrando o seu teste.
- Os nomes de provedor são conferidos: `Sms::provider('twillio')` lança uma exceção, igualzinho em produção.
- O `SmsSending` e o `SmsSent` disparam, então você pode testar seus listeners, inclusive um listener que cancela um envio.
- Drivers registrados com `Sms::extend()` continuam funcionando.
- Cada mensagem é registrada do jeito que estava no momento do envio, mesmo que o seu código a altere depois.

## Testando um driver

Para testar a integração com um provedor, inclusive o seu próprio [driver personalizado](/pt/guide/custom-drivers), faça o fake da camada HTTP. Todo driver HTTP usa o HTTP client do Laravel, então o `Http::fake()` intercepta as requisições dele:

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

Adicione `Http::preventStrayRequests()` para garantir que nada escape para uma API real.

::: info Amazon SNS
O driver do SNS usa o SDK da AWS, e não o HTTP client do Laravel, então o `Http::fake()` não o alcança. Nesse caso, passe um `SnsClient` mockado para o driver: `new AwsSnsDriver($config, $snsClient)`.
:::
