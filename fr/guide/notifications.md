# Notifications

<p class="lead">Si votre application envoie déjà des e-mails via les notifications Laravel, le SMS n'est qu'un canal de plus. Le package l'enregistre sous le nom <code>sms</code>.</p>

## Écrire une notification {#writing-a-notification}

Ajoutez `sms` à `via()` et renvoyez le message depuis `toSms()` :

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

Quand vous n'avez besoin de rien d'autre, `toSms()` peut aussi renvoyer une simple chaîne :

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

Pour mettre les notifications SMS en file d'attente, implémentez `ShouldQueue` sur la notification, comme pour n'importe quelle notification Laravel. Laravel crée un job par notifiable et par canal : le SMS et l'e-mail sont donc relancés indépendamment l'un de l'autre.

Envoyez les jobs SMS dans leur propre file avec `viaQueues()` :

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

Sous Laravel 13, le nombre de tentatives peut se déclarer par attribut :

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

Si la notification est envoyée à l'intérieur d'une transaction de base de données, chaînez `afterCommit()` : le SMS ne partira jamais pour une commande dont la transaction a été annulée.

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

## Router vers un numéro de téléphone {#routing-to-a-phone-number}

Le canal demande au notifiable où envoyer le message. Ajoutez `routeNotificationForSms()` à votre modèle :

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

Si la méthode renvoie `null` ou une chaîne vide, le SMS est ignoré sans bruit. C'est pratique pour les utilisateurs qui n'ont pas renseigné de numéro.

Un message qui a déjà des destinataires leur est envoyé directement, et le routage est ignoré.

### Notifications à la demande {#on-demand-notifications}

Pour notifier quelqu'un qui ne figure pas parmi les utilisateurs de votre base de données :

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## La notification prête à l'emploi {#the-ready-made-notification}

Pour les messages ponctuels, `SmsNotification` vous évite d'écrire une classe :

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## Le trait HasSms {#the-hassms-trait}

Pour envoyer rapidement un SMS directement depuis un modèle, ajoutez `HasSms` :

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

Les deux méthodes envoient immédiatement et renvoient le `SmsResult`. Avec le trait, gardez le paramètre `$notification` facultatif, comme ci-dessus : la même méthode sert alors aussi bien aux notifications qu'aux helpers.
