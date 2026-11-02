# Performances

<p class="lead">Envoyer un SMS, c'est surtout attendre la réponse d'un fournisseur. Le package met ce temps à profit : moins de requêtes quand le fournisseur le permet, des requêtes en parallèle quand il ne le permet pas.</p>

## Fournisseurs à envoi groupé : une seule requête {#bulk-providers-one-request}

Ces fournisseurs acceptent plusieurs destinataires dans un même appel d'API : un message destiné à 200 personnes tient donc en une seule requête HTTP.

**Sinch, Plivo, Infobip, ClickSend, Clickatell, Sparrow SMS, Sendchamp, Africa's Talking, BulkSMS, SendPulse**, ainsi que les modèles **MSG91**.

Clickatell accepte jusqu'à 100 destinataires par appel ; le package découpe automatiquement les envois plus importants en lots.

## Fournisseurs à un destinataire par requête : en parallèle {#per-recipient-providers-in-parallel}

**Twilio, Vonage, Telnyx, Bird, Brevo, Bandwidth, WhatsApp, Termii** et **MSG91** en texte libre traitent un destinataire par requête. Plutôt que d'attendre la fin de chaque requête avant de lancer la suivante, le package les envoie en parallèle grâce à `Http::pool()` de Laravel.

Par défaut, dix requêtes s'exécutent simultanément :

```ini [.env]
SMS_HTTP_CONCURRENCY=10
```

Avec environ 300 ms par aller-retour chez le fournisseur, 100 destinataires prennent à peu près trois secondes au lieu de trente. Augmentez cette valeur pour les gros lots si la limite de débit de votre fournisseur le permet ; baissez-la si vous voyez apparaître des `429 Too Many Requests`.

Amazon SNS publie via le SDK AWS, un destinataire à la fois.

## Timeouts {#timeouts}

```ini [.env]
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
```

Le timeout de connexion fait échouer rapidement l'envoi quand un fournisseur est injoignable, ce qui compte surtout dans une chaîne de [basculement](/fr/guide/failover) : le fournisseur suivant prend le relais au bout de 10 secondes au lieu de rester bloqué.

## Mise en cache des jetons {#token-caching}

Bandwidth et SendPulse utilisent OAuth. Leurs jetons d'accès sont mis en cache dans le store de cache de Laravel jusqu'à peu avant leur expiration : la plupart des envois s'épargnent ainsi un aller-retour supplémentaire. Si un fournisseur rejette un jeton avant l'heure, par exemple après une rotation de vos identifiants, ce jeton est supprimé et l'envoi suivant en récupère un nouveau.

## Dans votre application {#in-your-application}

- **Mettez en file d'attente les envois effectués pendant une requête web.** Les [files d'attente](/fr/guide/queueing) sortent complètement l'attente réseau de la requête.
- **Utilisez un fournisseur à envoi groupé pour les gros lots.** Une seule requête tient bien mieux la charge que des centaines.
- **Envoyez un seul message par lot.** Envoyer un message à 500 numéros est bien plus rapide que 500 envois séparés du même texte.
