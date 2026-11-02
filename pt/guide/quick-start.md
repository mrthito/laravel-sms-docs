# Sua primeira mensagem

<p class="lead">Um tour guiado pelas cinco coisas que você mais vai fazer: enviar, conferir o resultado, colocar na fila, notificar e testar.</p>

## Envie uma mensagem

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

Os números podem ter espaços, hífens, pontos e parênteses: `+1 (555) 123-4567` e `+15551234567` são o mesmo destinatário. Sempre que puder, use o formato internacional com o `+` na frente. A maioria dos provedores precisa dele para rotear a mensagem.

## Veja o que aconteceu

O `sendNow()` envia na hora e devolve um `SmsResult`:

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // o ID da mensagem no provedor, vale a pena guardar
```

Se o provedor recusar a mensagem, uma `DeliveryException` explica o motivo:

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

Em [Resultados e erros](/pt/guide/results) você encontra as falhas parciais e o que cada propriedade guarda.

## Coloque na fila

Enviar exige uma ida e volta pela rede. Dentro de uma requisição web, coloque a mensagem na fila para que seus usuários não fiquem esperando:

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## Envie como notificação

Se você já usa as notificações do Laravel, adicione o canal `sms`:

```php
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.");
    }
}
```

O canal pede um número ao seu model pelo `routeNotificationForSms()`. Os detalhes estão em [Notificações](/pt/guide/notifications).

## Teste

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

Esse é o coração do pacote. O restante deste guia aprofunda cada parte, começando por [como montar mensagens](/pt/guide/sending).
