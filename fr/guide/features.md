# Fonctionnalités

<p class="lead">Tout ce que fait le package, sur une seule page. Chaque ligne renvoie à la partie du guide qui l'explique.</p>

## Envoi {#sending}

| | |
|---|---|
| **Une API, vingt fournisseurs** | Twilio, Vonage, Sinch, Bird, Plivo, Telnyx, Infobip, ClickSend, Clickatell, Brevo, Bandwidth, SendPulse, Amazon SNS, WhatsApp, MSG91, Sparrow SMS, Termii, Sendchamp, Africa's Talking et BulkSMS. [Fournisseurs →](/fr/providers/) |
| **Builder fluide** | `Sms::to()->message()->send()`, avec un message tout neuf à chaque appel. [Composer un message →](/fr/guide/sending) |
| **Nettoyage des numéros** | Espaces, tirets, points et parenthèses supprimés, doublons écartés, numéros invalides refusés avant l'envoi. [Destinataires →](/fr/guide/sending#recipients) |
| **Expéditeur personnalisable** | `->from('ACME')`, message par message. [Expéditeur →](/fr/guide/sending#sender) |
| **Modèles (templates)** | Flows MSG91 (DLT), modèles WhatsApp et modèles Brevo, avec un texte de repli pour les autres fournisseurs. [Modèles de message →](/fr/guide/templates) |
| **Macros** | Donnez un nom à vos messages récurrents : `Sms::sendOtp($phone, $code)`. [Macros →](/fr/guide/sending#macros) |

## Fiabilité {#reliability}

| | |
|---|---|
| **Résultats avec identifiants de message** | Chaque envoi renvoie les identifiants du fournisseur pour chaque destinataire accepté. [Résultats →](/fr/guide/results) |
| **Échecs détaillés** | `DeliveryException` liste les destinataires en échec et ceux qui sont passés. [Échecs partiels →](/fr/guide/results#partial-failures) |
| **Basculement (failover)** | Enchaînez les fournisseurs : seuls les destinataires refusés passent au suivant, personne ne reçoit le message deux fois. [Basculement →](/fr/guide/failover) |
| **Répartition de charge** | Répartissez les messages sur un groupe de fournisseurs. [Répartition de charge →](/fr/guide/failover#load-balancing) |
| **Files d'attente** | `sendLater()`, `sendLaterAt()`, un job chiffré par destinataire, avec nouvelles tentatives. [Files d'attente →](/fr/guide/queueing) |

## Rapidité {#speed}

| | |
|---|---|
| **Requêtes groupées** | Les fournisseurs dotés d'un endpoint d'envoi groupé reçoivent tous les destinataires en un seul appel. [Performances →](/fr/guide/performance) |
| **Requêtes parallèles** | Pour les autres, les requêtes s'exécutent en parallèle, dix à la fois par défaut. [Performances →](/fr/guide/performance#per-recipient-providers-in-parallel) |
| **Mise en cache des jetons** | Les jetons OAuth sont réutilisés jusqu'à leur expiration. [Mise en cache des jetons →](/fr/guide/performance#token-caching) |

## Intégration à Laravel {#laravel-integration}

| | |
|---|---|
| **Canal de notification** | `via()` renvoie `'sms'`, et `toSms()` renvoie le message. [Notifications →](/fr/guide/notifications) |
| **Événements** | `SmsSending` (annulable), `SmsSent`, `SmsFailed` et `SmsWebhookReceived`. Laravel trouve vos classes de listener tout seul. [Événements →](/fr/guide/events) |
| **Webhooks** | Accusés de réception signés pour WhatsApp, Termii, Sendchamp, Africa's Talking et BulkSMS. [Webhooks →](/fr/guide/webhooks) |
| **Artisan** | `php artisan sms:test` et une section dans `php artisan about`. [Artisan →](/fr/reference/artisan) |
| **Compatible Octane et files d'attente** | Aucun état partagé entre les envois ni entre les requêtes. |

## Tests {#testing}

| | |
|---|---|
| **`Sms::fake()`** | Enregistre les messages au lieu de les envoyer, avec des assertions lisibles. [Tests →](/fr/guide/testing) |
| **`Http::fake()`** | Tous les drivers HTTP reposent sur le client HTTP de Laravel. [Tester un driver →](/fr/guide/testing#testing-a-driver) |

## Sécurité {#security}

| | |
|---|---|
| **Webhooks fermés par défaut** | Les requêtes non signées ou invérifiables sont rejetées. [Webhooks →](/fr/guide/webhooks) |
| **Charges utiles chiffrées en file d'attente** | Codes et numéros sont chiffrés avec votre `APP_KEY`. [Files d'attente →](/fr/guide/queueing#encrypted-at-rest) |
| **Hygiène des identifiants d'accès** | Aucun secret dans les messages d'exception, les URL ou les clés de cache ; numéros masqués dans les journaux. [Sécurité →](/fr/guide/security) |

## Extension {#extending}

| | |
|---|---|
| **Drivers sur mesure** | Étendez `HttpDriver` et décrivez uniquement l'API du fournisseur. [Drivers sur mesure →](/fr/guide/custom-drivers) |
| **Enregistrement à l'exécution** | `Sms::extend('acme', …)` depuis un service provider. [Enregistrement à l'exécution →](/fr/guide/custom-drivers#registering-at-runtime) |
