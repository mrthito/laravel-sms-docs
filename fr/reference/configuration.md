# Configuration

<p class="lead">Tout le contenu de <code>config/sms.php</code>, avec la variable d'environnement correspondant à chaque option. Publiez le fichier avec <code>php artisan vendor:publish --tag=sms-config</code> ; vous aurez rarement besoin de le modifier.</p>

## Envoi {#sending}

| Option | Environnement | Défaut | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | Fournisseur utilisé quand un message n'en désigne aucun. Accepte aussi `failover` et `random`. |
| `random_drivers` | — | `['twilio', 'msg91']` | Le groupe dans lequel `random` fait son choix. |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | Chaîne pour `failover`, séparée par des virgules et essayée dans l'ordre. |

## Files d'attente {#queueing}

| Option | Environnement | Défaut | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | Si `true`, `send()` met en file d'attente au lieu d'envoyer immédiatement. |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | celle de votre application | Connexion de file d'attente pour les jobs SMS. |
| `queue_name` | `SMS_QUEUE_NAME` | celle de votre application | Nom de la file d'attente pour les jobs SMS. |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | Nombre de tentatives par destinataire avant l'échec d'un job. |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | Durée d'exécution maximale d'un job, en secondes. Gardez le `retry_after` de votre file au-dessus de cette valeur. |
| `retry.backoff` | — | `[10, 30, 60]` | Secondes d'attente avant chaque nouvelle tentative. |

## HTTP {#http}

| Option | Environnement | Défaut | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | Secondes d'attente de la réponse d'un fournisseur. |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | Secondes d'attente pour établir la connexion. |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | Requêtes parallèles pour les fournisseurs à un destinataire par requête. |

## Webhooks {#webhooks}

| Option | Environnement | Défaut | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | Enregistre la route des webhooks. |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | Préfixe d'URL, auquel s'ajoute la clé du fournisseur. |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | Middlewares appliqués à la route. |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | Secret de l'application Meta. |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | Jeton pour la vérification d'abonnement de Meta. |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | Transmis sous la forme `?token=` dans l'URL de callback. |

## Drivers et fournisseurs {#drivers-and-providers}

Deux tableaux associent une clé de fournisseur à son code et à ses identifiants d'accès :

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

`drivers` détermine quelle classe gère une clé, et `providers` contient les réglages de cette clé, qui sont transmis à la classe. Chaque [page fournisseur](/fr/providers/) liste ses réglages.

Pour utiliser le même fournisseur avec deux comptes, par exemple un compte transactionnel et un compte marketing, enregistrez la classe deux fois sous des clés différentes :

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## Mise en cache de la configuration {#config-caching}

La configuration ne contient aucune closure : `php artisan config:cache` fonctionne donc normalement. Relancez-la après chaque modification du `.env` en production.
