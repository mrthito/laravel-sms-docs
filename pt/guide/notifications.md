# Notificações

<p class="lead">Se a sua aplicação já envia e-mails pelas notificações do Laravel, o SMS é só mais um canal. O pacote o registra como <code>sms</code>.</p>

## Escrevendo uma notificação

Adicione `sms` ao `via()` e devolva a mensagem no `toSms()`:

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.")
            ->from('ACME');
    }
}
```

O `toSms()` também pode devolver uma string simples quando você não precisa de mais nada:

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

Para colocar notificações por SMS na fila, implemente `ShouldQueue` na notificação, como em qualquer notificação do Laravel. O Laravel cria um job por notifiable e por canal, então o SMS e o e-mail são retentados de forma independente.

Mande os jobs de SMS para uma fila própria com `viaQueues()`:

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

No Laravel 13, os limites de tentativas podem ser declarados com atributos:

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

Se a notificação for enviada dentro de uma transação de banco de dados, encadeie `afterCommit()` para que o SMS nunca saia por causa de um pedido que sofreu rollback:

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

## Direcionando para um número de telefone

O canal pergunta ao notifiable para onde enviar. Adicione `routeNotificationForSms()` ao seu model:

```php
class User extends Authenticatable
{
    use Notifiable;

    public function routeNotificationForSms(Notification $notification): ?string
    {
        return $this->phone;
    }
}
```

Se ele devolver `null` ou uma string vazia, o SMS é ignorado sem alarde. Isso é útil para usuários que ainda não cadastraram um número.

Uma mensagem que já tem destinatários é enviada para eles, e o roteamento é ignorado.

### Notificações sob demanda

Notifique alguém que não é um usuário do seu banco de dados:

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## A notificação pronta

Para mensagens avulsas, a `SmsNotification` poupa você de escrever uma classe:

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## A trait HasSms

Para envios rápidos direto de um model, adicione a `HasSms`:

```php
use MrRijal\LaravelSms\Traits\HasSms;

class User extends Authenticatable
{
    use HasSms, Notifiable;

    public function routeNotificationForSms(?Notification $notification = null): string
    {
        return $this->phone;
    }
}

$user->sms('Your order has shipped.');
$user->smsTemplate('otp', ['code' => 4821]);
```

Os dois enviam na hora e devolvem o `SmsResult`. Com a trait, deixe o parâmetro `$notification` opcional, como acima, para que o mesmo método atenda tanto as notificações quanto os helpers.
