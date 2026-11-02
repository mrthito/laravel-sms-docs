# Tests

<p class="lead">Un test ne devrait jamais envoyer de SMS à un vrai téléphone. Simulez la façade, exécutez votre code, puis vérifiez ce qui aurait été envoyé.</p>

## Simuler les envois {#faking-sends}

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

`Sms::fake()` fonctionne partout où le package envoie : la façade, les notifications, le trait `HasSms` et les jobs en file d'attente.

## Assertions disponibles {#available-assertions}

| Assertion | Réussit lorsque |
|---|---|
| `assertSent($callback)` | Au moins un message envoyé correspond au callback |
| `assertSent($count)` | Exactement `$count` messages ont été envoyés |
| `assertSentTo($number, $callback = null)` | Un message est parti vers `$number`, quel que soit le format d'écriture |
| `assertNotSent($callback = null)` | Aucun message envoyé ne correspond |
| `assertNothingSent()` | Rien n'a été envoyé du tout |
| `assertSentCount($count)` | Exactement `$count` messages ont été envoyés |
| `assertQueued($callback or $count)` | Un message a été mis en file d'attente, ou exactement `$count` l'ont été (un par destinataire) |
| `assertNothingQueued()` | Rien n'a été mis en file d'attente |

Pour examiner les messages vous-même, `Sms::sent()` et `Sms::queued()` renvoient des collections de `SmsMessage`.

## Il se comporte comme le vrai {#it-behaves-like-the-real-thing}

Le fake n'appelle aucun fournisseur, mais il fait tout ce qui précède cet appel :

- Les messages sont validés : un numéro invalide fait donc toujours échouer votre test.
- Les noms de fournisseurs sont vérifiés : `Sms::provider('twillio')` lève une exception, exactement comme en production.
- `SmsSending` et `SmsSent` sont déclenchés : vous pouvez tester vos listeners, y compris un listener qui annule un envoi.
- Les drivers enregistrés avec `Sms::extend()` continuent de fonctionner.
- Chaque message est enregistré tel qu'il était au moment de l'envoi, même si votre code le modifie ensuite.

## Tester un driver {#testing-a-driver}

Pour tester l'intégration d'un fournisseur, y compris votre propre [driver sur mesure](/fr/guide/custom-drivers), simulez plutôt la couche HTTP. Tous les drivers HTTP s'appuient sur le client HTTP de Laravel : `Http::fake()` intercepte donc leurs requêtes.

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

Ajoutez `Http::preventStrayRequests()` pour vous assurer que rien ne s'échappe vers une vraie API.

::: info Amazon SNS
Le driver SNS passe par le SDK AWS et non par le client HTTP de Laravel : `Http::fake()` ne l'atteint donc pas. Passez plutôt un `SnsClient` mocké au driver : `new AwsSnsDriver($config, $snsClient)`.
:::
