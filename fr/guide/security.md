# Sécurité

<p class="lead">Les SMS transportent des codes de connexion, des détails de commande et des numéros de téléphone personnels. Voici les réglages par défaut qui les protègent, et les quelques points qui dépendent de vous.</p>

## Ce que le package fait pour vous {#what-the-package-does-for-you}

**Les identifiants d'accès restent là où vous les avez mis.** Clés d'API et jetons sont lus depuis votre configuration et envoyés uniquement au fournisseur concerné. Ils n'apparaissent jamais dans les messages d'exception ni dans les paramètres d'URL, et les jetons OAuth sont mis en cache sous une clé hachée : un dump du cache ne les révèle donc pas.

**Les erreurs des fournisseurs sont bornées.** Quand un fournisseur explique un refus, le package ne conserve que cette explication, tronquée à 200 caractères, pour que les échecs restent faciles à déboguer. Le reste de la réponse du fournisseur n'est jamais recopié dans l'exception. Ces messages sont journalisés lorsqu'un envoi échoue. Un fournisseur peut reprendre une partie de votre requête dans son message d'erreur : considérez donc les journaux d'échec SMS comme sensibles.

**Les numéros de téléphone sont masqués dans les journaux.** Les lignes de journal du package affichent `***4567`, jamais le numéro complet.

**Les messages en file d'attente sont chiffrés.** Chaque job SMS en file d'attente est chiffré avec votre `APP_KEY` : les codes de connexion ne sont lisibles ni dans Redis, ni dans votre base de données, ni dans SQS.

**Dans le doute, les webhooks refusent.** Un endpoint de webhook sans secret configuré rejette toutes les requêtes. Avec un secret, les signatures sont comparées en temps constant. Voir [Webhooks](/fr/guide/webhooks).

**Les entrées sont vérifiées avant l'envoi.** Numéros mal formés, messages vides et fournisseurs inconnus échouent avant la moindre requête. Les URL de base configurables des fournisseurs, comme celles d'Infobip et de Termii, doivent utiliser HTTPS.

## Ce qui dépend de vous {#what-s-up-to-you}

- **Gardez vos identifiants d'accès dans l'environnement** ou dans un gestionnaire de secrets, jamais dans le dépôt de code. Faites-les tourner en cas de fuite.
- **Limitez le débit des endpoints qui envoient des SMS.** Un formulaire de connexion qui envoie un code par SMS est une cible facile pour la fraude dite « SMS pumping », où des attaquants déclenchent des envois vers des numéros surtaxés à vos frais. Limitez par numéro de téléphone et par adresse IP (voir ci-dessous).
- **Laissez les webhooks désactivés** tant que vous n'en avez pas besoin, et servez-les en HTTPS.
- **N'utilisez pas le driver `log` en production.** Il écrit le texte complet des messages, codes compris, dans vos fichiers de journal.
- **Protégez votre `APP_KEY`.** C'est elle qui déchiffre les messages en file d'attente. Lorsque vous la changez, indiquez l'ancienne clé dans `APP_PREVIOUS_KEYS` pour que les jobs déjà en file d'attente restent lisibles.
- **Tenez Laravel et le package à jour.** Laravel 11 ne reçoit plus de correctifs de sécurité.

## Limiter l'envoi des codes de connexion {#rate-limiting-login-codes}

Avec le `RateLimiter` de Laravel, la limite par numéro tient en quelques lignes :

```php
use Illuminate\Support\Facades\RateLimiter;
use MrRijal\LaravelSms\Facades\Sms;

$sent = RateLimiter::attempt(
    key: 'sms-code:'.$request->string('phone'),
    maxAttempts: 3,
    callback: fn () => Sms::to($request->string('phone'))->message("Your code is {$code}")->sendNow(),
    decaySeconds: 600,
);

if (! $sent) {
    return back()->withErrors(['phone' => 'Too many codes requested. Try again in a few minutes.']);
}
```

Ajoutez une seconde limite par adresse IP avec le middleware `throttle` sur la route, par exemple `->middleware('throttle:10,1')`.

## Signaler une vulnérabilité {#reporting-a-vulnerability}

Merci d'écrire à [prashantrijal.721@gmail.com](mailto:prashantrijal.721@gmail.com) plutôt que d'ouvrir une issue publique. Vous recevrez une réponse dès que possible, et un correctif sera publié avant que les détails ne soient rendus publics.
