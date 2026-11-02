# Installation

<p class="lead">Une commande Composer et quelques lignes dans le <code>.env</code>. Le service provider et la façade <code>Sms</code> s'enregistrent d'eux-mêmes.</p>

## Installer le package {#install-the-package}

```bash
composer require mr-rijal/laravel-sms
```

Publiez ensuite le fichier de configuration. Il vous servira dès que vous ajouterez un deuxième fournisseur ou modifierez les valeurs par défaut.

```bash
php artisan vendor:publish --tag=sms-config
```

Cette commande crée `config/sms.php`. Tout y est lu depuis des variables d'environnement : la plupart des projets n'ont jamais à modifier le fichier lui-même.

## Choisir un fournisseur {#choose-a-provider}

Définissez votre fournisseur par défaut et ses identifiants d'accès. Avec Twilio, par exemple :

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

Chaque page fournisseur indique précisément les variables nécessaires. Si vous n'avez pas encore fait votre choix, commencez par la [vue d'ensemble des fournisseurs](/fr/providers/).

::: tip Vous développez en local ?
Laissez `SMS_PROVIDER` vide. Le driver par défaut est alors `log`, qui écrit chaque message dans le journal Laravel au lieu de l'envoyer : aucun SMS n'atterrit par erreur sur un vrai téléphone.
:::

## Vérifier que tout fonctionne {#check-that-it-works}

Envoyez un vrai message depuis le terminal. La commande emprunte exactement le même chemin que votre application :

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

En cas de problème, la commande vous rapporte la réponse du fournisseur, par exemple `Failed to send SMS via Twilio (HTTP 401): Authenticate`. Testez un fournisseur précis avec `--provider=sinch`, ou votre propre texte avec `--message="Hello"`.

`php artisan about` affiche aussi une section **Laravel SMS** qui indique votre fournisseur par défaut et si la file d'attente et les webhooks sont activés.

## Facultatif : Amazon SNS {#optional-amazon-sns}

Le SDK AWS est volumineux : il n'est donc installé que si vous en avez besoin. Si vous comptez utiliser le driver [Amazon SNS](/fr/providers/aws-sns) :

```bash
composer require aws/aws-sdk-php
```

## Et ensuite ? {#next-steps}

[Envoyer votre premier SMS →](/fr/guide/quick-start)
