# Log

<p class="lead">Le driver par défaut. Il écrit chaque message dans le journal Laravel au lieu de l'envoyer : vous pouvez ainsi développer et essayer vos fonctionnalités SMS sans compte chez un fournisseur ni vrai téléphone.</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # facultatif : un canal dédié défini dans config/logging.php
```

Chaque message produit une entrée de niveau `debug` :

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

Les destinataires sont masqués, mais le texte du message est journalisé en entier pour que vous puissiez lire vos codes pendant le développement. C'est aussi pourquoi le driver log ne doit **jamais être utilisé en production** : les codes de connexion se retrouveraient dans vos fichiers de journal.

`sendNow()` renvoie un `SmsResult` avec un identifiant de message généré de la forme `log-…` : le code qui stocke les identifiants fonctionne donc sans modification.
