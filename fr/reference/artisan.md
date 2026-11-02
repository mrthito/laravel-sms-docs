# Commandes Artisan

## sms:test {#sms-test}

Envoie un vrai message pour vérifier vos identifiants d'accès, en empruntant le même chemin que votre application.

```bash
php artisan sms:test {to} [--provider=] [--message=]
```

| | |
|---|---|
| `to` | Destinataire, idéalement au format E.164 : `+15551234567` |
| `--provider` | Clé du fournisseur à utiliser. `SMS_PROVIDER` par défaut. |
| `--message` | Texte à envoyer. Par défaut, un court message de test. |

```bash
php artisan sms:test +15551234567 --provider=sinch --message="Hello from production"
```

En cas de succès, la commande affiche le fournisseur et l'identifiant du message. En cas d'échec, elle affiche la raison donnée par le fournisseur et se termine avec un code de sortie non nul : vous pouvez donc l'utiliser dans vos scripts de déploiement et vos health checks.

::: warning Elle envoie un vrai message
Et votre fournisseur vous le facture. Utilisez votre propre numéro.
:::

## about {#about}

La commande `php artisan about` de Laravel comporte une section **Laravel SMS** :

```text
  Laravel SMS ............................................................
  Default provider ................................................. twilio
  Queue .......................................................... disabled
  Webhooks ........................................................ enabled
```
