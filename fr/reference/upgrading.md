# Migrer depuis la 1.x

<p class="lead">La version 2 reconstruit le cœur du package autour de résultats plutôt que de booléens. La plupart des applications n'ont besoin que des trois premières étapes, qui prennent environ une demi-heure.</p>

## 1. Mettre à jour le package {#_1-update-the-package}

```bash
composer require mr-rijal/laravel-sms:^2.0
```

Si vous utilisez le driver **AWS SNS**, le SDK AWS n'est plus installé automatiquement :

```bash
composer require aws/aws-sdk-php
```

## 2. Republier ou fusionner la configuration {#_2-re-publish-or-merge-the-config}

```bash
php artisan vendor:publish --tag=sms-config --force
```

Si votre `config/sms.php` est personnalisé, reportez ces changements à la main :

- `default` se rabat désormais sur `log` au lieu de `fake`.
- Nouvelles sections : `retry`, `http` et `providers.failover`.
- Nouveaux fournisseurs : `sinch`, `bird`, `clicksend`, `clickatell`, `brevo`, `bandwidth`, `sendpulse`.
- Fournisseurs supprimés : `telegram_mirror`, `discord_webhook`, `slack_webhook`.

## 3. Des résultats au lieu de booléens {#_3-send-results-instead-of-booleans}

`send()`, `sendNow()` et les helpers de `HasSms` renvoient désormais `?SmsResult` au lieu de `bool`.

```php
// 1.x
if (Sms::to($n)->message('Hi')->sendNow()) { ... }

// 2.0
$result = Sms::to($n)->message('Hi')->sendNow();
$result?->firstId();
```

Le résultat vaut `null` lorsqu'un listener de `SmsSending` annule l'envoi, ou lorsque `send()` met le message en file d'attente. Les échecs lèvent toujours une exception, comme en 1.x.

## Drivers supprimés {#removed-drivers}

Les drivers miroirs Telegram, Discord et Slack ont été supprimés : ils n'ont jamais livré le moindre SMS. Si vous les utilisiez pour des alertes internes, écoutez plutôt l'événement `SmsSent` et publiez dans votre canal à l'aide d'une notification Laravel.

## Exceptions {#exceptions}

Les échecs côté fournisseur lèvent `MrRijal\LaravelSms\Exceptions\DeliveryException` (toujours une `RuntimeException`). Une entrée invalide lève `InvalidMessageException`, et une mauvaise configuration `InvalidConfigurationException` (toutes deux toujours des `InvalidArgumentException`). Interceptez `MrRijal\LaravelSms\Exceptions\SmsException` pour les traiter toutes.

`DeliveryException::$failedRecipients` et `DeliveryException::$partial` vous indiquent qui a reçu le message et qui ne l'a pas reçu.

## Événements {#events}

- `SmsSent` n'a plus de propriétés `success` ni `error`. Il n'est déclenché qu'en cas de succès et transporte `result` (un `SmsResult`).
- Les échecs déclenchent le nouvel événement `SmsFailed`, avec l'`exception`.
- Les listeners de `SmsSending` peuvent désormais renvoyer `false` pour annuler l'envoi.

## Notifications {#notifications}

`toSms()` doit désormais **renvoyer** un `SmsMessage` (ou une chaîne) au lieu d'envoyer le message lui-même. Le canal le route avec `routeNotificationForSms()` et prend en charge `Notification::route('sms', $number)`.

```php
// 1.x
public function toSms($notifiable): void
{
    Sms::to($notifiable->phone)->message('Shipped')->sendNow();
}

// 2.0
public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create('Shipped');
}
```

`SmsNotification` ne lit plus `sms.queue`. Pour mettre des notifications en file d'attente, implémentez `ShouldQueue` sur votre notification, comme pour n'importe quelle notification Laravel.

## Façade et manager {#facade-and-manager}

- `Sms::to()`, `Sms::provider()`, `Sms::message()` et `Sms::template()` renvoient désormais un nouveau `PendingSms` à chaque appel : aucun état n'est partagé entre les envois.
- `Sms::sendMessage($message, $provider)` est remplacé par `Sms::sendNow($message->provider($provider))`.
- `SmsManager` est construit avec le conteneur. Résolvez-le depuis le conteneur (`app(SmsManager::class)`) au lieu d'appeler `new SmsManager`.

## Drivers sur mesure {#custom-drivers}

`SmsProvider::send()` doit désormais renvoyer un `SmsResult` :

```php
public function send(SmsMessage $message): SmsResult
{
    // ... appel au fournisseur ...

    return SmsResult::accepted($message->getTo(), $providerMessageId);
}
```

Étendez `MrRijal\LaravelSms\Drivers\HttpDriver` pour bénéficier gratuitement de la validation de la configuration, des timeouts, des envois en parallèle, de la gestion des échecs partiels et de messages d'erreur sans risque. Les drivers utilisent désormais le client HTTP de Laravel : les constructeurs n'acceptent plus de `Client` Guzzle ; utilisez `Http::fake()` dans vos tests.

## Tests {#testing}

Remplacez les assertions sur `FakeDriver::$messages` par `Sms::fake()` :

```php
Sms::fake();
// ...
Sms::assertSentTo('+15551234567');
```

`FakeDriver` existe toujours pour les applications qui en dépendent.
