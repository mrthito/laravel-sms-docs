# Drivers sur mesure

<p class="lead">Si votre fournisseur n'est pas intégré, un driver tient en une petite classe. La classe de base gère les timeouts, la concurrence, les échecs partiels et des messages d'erreur sans risque : vous n'avez qu'à décrire l'API du fournisseur.</p>

## Un driver complet {#a-complete-driver}

Voici un driver pour un fournisseur fictif, Acme, qui accepte un destinataire par requête :

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

Enregistrez-le dans `config/sms.php` :

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

Il fonctionne alors comme n'importe quel fournisseur intégré : `Sms::provider('acme')`, chaînes de basculement, files d'attente, `php artisan sms:test --provider=acme`.

## Ce que la classe de base vous apporte {#what-the-base-class-gives-you}

| Méthode | Sert à |
|---|---|
| `require('key', …)` | Échouer immédiatement avec « Acme configuration is incomplete » quand des réglages manquent |
| `value('key')` | Lire un réglage obligatoire sous forme de chaîne, débarrassée des espaces en début et en fin |
| `string('key', $default)` / `bool('key')` | Lire des réglages facultatifs |
| `oneOf('key', [...], $default)` | N'accepter que des valeurs connues, une région par exemple |
| `httpsUrl('key', $default)` | N'accepter une URL de base que si elle utilise HTTPS |
| `text($message)` | Obtenir le texte, ou rejeter avec une erreur claire les messages composés uniquement d'un modèle |
| `sender($message)` | Le `from()` du message, ou à défaut l'expéditeur configuré |
| `sendEach(…)` | Une requête par destinataire, exécutées en parallèle, avec suivi des échecs partiels |
| `sendOnce(…)` | Une seule requête pour tous les destinataires, pour les fournisseurs dotés d'un endpoint d'envoi groupé |
| `fail($response, 'json.path')` | Lever une `DeliveryException` avec la raison donnée par le fournisseur, tronquée à 200 caractères |
| `jsonString($response, 'path')` | Lire une chaîne (ou un entier) dans le corps de la réponse |
| `cachedToken($clientId, fn () => …)` | Récupérer un jeton OAuth et le mettre en cache jusqu'à peu avant son expiration |

Les requêtes construites par la classe de base ont déjà des timeouts, un en-tête `Accept` JSON et un `User-Agent`, et elles apparaissent dans `Http::fake()` comme n'importe quelle autre requête.

## Endpoints d'envoi groupé {#bulk-endpoints}

Si le fournisseur accepte plusieurs destinataires dans un même appel, utilisez `sendOnce()` et construisez vous-même le résultat :

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

Si le fournisseur rend compte de chaque destinataire séparément, levez une `DeliveryException` avec `failedRecipients` et un résultat `partial` pour ceux qu'il a acceptés. Le [driver ClickSend](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php) est un bon modèle à reprendre.

## Enregistrement à l'exécution {#registering-at-runtime}

Pour les drivers qui ont besoin de dépendances issues du conteneur, enregistrez une factory dans `AppServiceProvider` :

```php
// app/Providers/AppServiceProvider.php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

`$config` correspond à l'entrée du driver dans `sms.providers`. Les drivers enregistrés de cette façon continuent de fonctionner sous Octane, dans les workers de file d'attente et avec `Sms::fake()`.

## Le strict minimum {#the-minimum}

Toute classe qui implémente `MrRijal\LaravelSms\Contracts\SmsProvider` est un driver valide. Elle n'a besoin que d'une méthode :

```php
public function send(SmsMessage $message): SmsResult;
```

Renvoyez les destinataires acceptés, et levez une `DeliveryException` en cas d'échec. Étendre `HttpDriver` n'est pas obligatoire, mais vous épargne bien des cas limites.

## Recevoir des webhooks {#receiving-webhooks}

Pour accepter les accusés de réception de votre driver, implémentez `MrRijal\LaravelSms\Contracts\HandlesWebhooks` et utilisez le trait `VerifiesWebhooks` pour la vérification des signatures. Les requêtes vers `/laravel-sms/webhook/acme` sont alors routées vers votre méthode `handleWebhook()`. Le [driver Termii](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php) intégré illustre ce fonctionnement.
