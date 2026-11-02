# Événements

<p class="lead">Quatre événements couvrent toute la vie d'un message. Servez-vous-en pour des journaux d'audit, des statistiques, des listes de désinscription, ou pour stopper un message au dernier moment.</p>

| Événement | Déclenché | Propriétés |
|---|---|---|
| `SmsSending` | Avant l'appel au fournisseur | `message`, `provider` |
| `SmsSent` | Après l'acceptation du message par le fournisseur | `message`, `provider`, `result` |
| `SmsFailed` | Après l'échec d'un envoi (l'exception est tout de même levée) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | À la réception d'un webhook vérifié d'un fournisseur | `provider`, `payload`, `messageId`, `status`, `recipient` |

Ils se trouvent tous les quatre dans l'espace de noms `MrRijal\LaravelSms\Events`. `provider` est le nom du fournisseur par lequel le message est passé. Avec `random`, c'est le fournisseur tiré au sort, par exemple `twilio` ; avec `failover`, c'est `failover`.

## Écrire un listener {#writing-a-listener}

Depuis Laravel 11, les listeners s'enregistrent d'eux-mêmes. Générez-en un, typez l'événement dans `handle()`, et Laravel se charge du branchement : ni service provider, ni tableau `$listen`.

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

Laravel parcourt `app/Listeners`, trouve `handle(SmsSent $event)` et inscrit le listener pour cet événement. Pour vérifier ce qu'il a découvert :

```bash
php artisan event:list --event=SmsSent
```

En production, `php artisan optimize` met en cache les listeners découverts, en même temps que votre configuration et vos routes.

::: tip Un listener ne peut pas provoquer de doublon
Au moment où `SmsSent` est déclenché, le fournisseur a déjà le message. Si l'un de vos listeners lève une exception, celle-ci est transmise à votre gestionnaire d'erreurs et l'envoi reste considéré comme réussi. Ainsi, un job en file d'attente ne renvoie jamais le même texte simplement parce que l'écriture d'un journal d'audit a échoué.
:::

### Un listener, plusieurs événements {#one-listener-several-events}

Les types union fonctionnent aussi. Ce listener traite les deux issues possibles :

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### Listeners en file d'attente {#queued-listeners}

Écrire en base de données ou appeler une API de statistiques ne devrait pas ralentir un envoi. Implémentez `ShouldQueue` et le listener s'exécute dans votre file d'attente :

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

Sous Laravel 13, vous pouvez choisir la file avec un attribut :

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## Annuler un envoi {#cancelling-a-send}

Si un listener de `SmsSending` renvoie `false`, le message n'est pas envoyé. `sendNow()` renvoie alors `null`.

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // Les personnes qui ont répondu STOP n'entendent plus parler de nous.
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

Renvoyez `null` (ou rien du tout) pour laisser passer le message. Seul un `false` explicite annule l'envoi.

::: warning Gardez ce listener synchrone
Un listener d'annulation ne doit pas implémenter `ShouldQueue`. Un listener en file d'attente s'exécute alors que le message est déjà parti : il n'a plus rien à annuler.
:::

Le listener voit le message complet : `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()` et `getProvider()`.

## Réagir aux échecs {#reacting-to-failures}

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

`getRedactedRecipientsForLogging()` masque tous les chiffres sauf les quatre derniers (`***4567`) : les numéros de téléphone ne s'accumulent pas dans vos journaux.

Le package écrit déjà une ligne de journal de niveau `error` pour chaque envoi échoué. Les envois réussis ne sont pas journalisés : ajoutez un listener de `SmsSent` si vous voulez les conserver.

## Listeners sous forme de closure {#closure-listeners}

Pour un besoin ponctuel, une closure dans `AppServiceProvider::boot()` fait aussi l'affaire :

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

Les classes de listener sont plus faciles à tester et à mettre en file d'attente : préférez-les pour tout ce qui est appelé à durer.

## Tester vos listeners {#testing-your-listeners}

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

`Sms::fake()` déclenche `SmsSending` et `SmsSent` exactement comme un vrai envoi : vous pouvez donc aussi tester vos listeners de bout en bout. Voir [Tests](/fr/guide/testing).
