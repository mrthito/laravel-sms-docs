# Choisir un fournisseur

<p class="lead">Tous les fournisseurs passent par la même API : ce choix est une affaire de prix, de couverture et de formalités, pas de code. Vous pourrez changer d'avis plus tard en modifiant une seule ligne du <code>.env</code>.</p>

## En un coup d'œil {#at-a-glance}

| Fournisseur | Clé | Couverture | Envoi | Modèles | Webhooks |
|---|---|---|---|---|---|
| [Twilio](/fr/providers/twilio) | `twilio` | Monde | Parallèle |  |  |
| [Vonage](/fr/providers/vonage) | `vonage` | Monde | Parallèle |  |  |
| [Sinch](/fr/providers/sinch) | `sinch` | Monde | Groupé |  |  |
| [Bird](/fr/providers/bird) | `bird` | Monde | Parallèle |  |  |
| [Plivo](/fr/providers/plivo) | `plivo` | Monde | Groupé |  |  |
| [Telnyx](/fr/providers/telnyx) | `telnyx` | Monde | Parallèle |  |  |
| [Infobip](/fr/providers/infobip) | `infobip` | Monde | Groupé |  |  |
| [ClickSend](/fr/providers/clicksend) | `clicksend` | Monde | Groupé |  |  |
| [Clickatell](/fr/providers/clickatell) | `clickatell` | Monde | Groupé |  |  |
| [Brevo](/fr/providers/brevo) | `brevo` | Monde | Parallèle | ✓ |  |
| [Bandwidth](/fr/providers/bandwidth) | `bandwidth` | États-Unis et Canada | Parallèle |  |  |
| [SendPulse](/fr/providers/sendpulse) | `sendpulse` | Monde | Groupé |  |  |
| [Amazon SNS](/fr/providers/aws-sns) | `aws_sns` | Monde | SDK |  |  |
| [WhatsApp](/fr/providers/whatsapp) | `whatsapp` | Monde | Parallèle | ✓ | ✓ |
| [MSG91](/fr/providers/msg91) | `msg91` | Inde | Les deux | ✓ |  |
| [Sparrow SMS](/fr/providers/sparrow) | `sparrow` | Népal | Groupé |  |  |
| [Termii](/fr/providers/termii) | `termii` | Nigeria et Afrique | Parallèle |  | ✓ |
| [Sendchamp](/fr/providers/sendchamp) | `sendchamp` | Nigeria et Afrique | Groupé |  | ✓ |
| [Africa's Talking](/fr/providers/africastalking) | `africastalking` | Toute l'Afrique | Groupé |  | ✓ |
| [BulkSMS](/fr/providers/bulksms) | `bulksms` | Monde, surtout en Afrique australe | Groupé |  | ✓ |

Les fournisseurs à envoi **groupé** reçoivent tous les destinataires en une seule requête. Les fournisseurs à envoi **parallèle** traitent un destinataire par requête, et le package envoie ces requêtes [en parallèle](/fr/guide/performance).

## Faire son choix {#picking-one}

**Partez de l'endroit où se trouvent vos utilisateurs.** Les fournisseurs internationaux couvrent presque tous les pays, mais les passerelles locales sont souvent moins chères et plus fiables sur leur propre terrain. Au Nigeria, [Termii](/fr/providers/termii) et [Sendchamp](/fr/providers/sendchamp) contournent les restrictions Do-Not-Disturb qui bloquent de nombreux expéditeurs internationaux. En Inde, [MSG91](/fr/providers/msg91) gère l'enregistrement DLT. Au Népal, [Sparrow SMS](/fr/providers/sparrow) est directement connecté aux deux opérateurs.

**Pensez ensuite à ce que vous envoyez.**

- *Les codes de connexion et les alertes* ont davantage besoin d'une livraison rapide et fiable que de prix bas. Twilio, Sinch, Vonage et Infobip disposent des connexions directes aux opérateurs les plus étendues.
- *Les annonces à grande échelle* se prêtent aux fournisseurs à envoi groupé, qui touchent tout le monde en une seule requête : Sinch, Plivo, Infobip, ClickSend, Clickatell.
- *Les conversations* où les clients répondent ont leur place sur [WhatsApp](/fr/providers/whatsapp) ou chez un fournisseur proposant des numéros bidirectionnels et des webhooks de livraison.

**Et enfin à ce que vous avez déjà.** Vous êtes sur AWS ? [Amazon SNS](/fr/providers/aws-sns) est facturé sur votre compte existant. Vous envoyez déjà vos e-mails via Brevo ? Ses [SMS](/fr/providers/brevo) partagent le même tableau de bord.

::: tip Ne dépendez pas d'un seul réseau
Quel que soit votre choix, placez un second fournisseur derrière lui grâce au [basculement](/fr/guide/failover). Les pannes sont rares, mais quand elles surviennent, vos codes de connexion continuent d'arriver.
:::

## Identifiants d'expéditeur et enregistrement {#sender-ids-and-registration}

La plupart des pays exigent désormais une forme d'enregistrement avant de pouvoir envoyer des SMS d'application à personne (A2P) à grande échelle :

- **États-Unis :** enregistrement de la marque et de la campagne 10DLC, ou numéro gratuit (toll-free) vérifié.
- **Inde :** enregistrement DLT de votre identifiant d'expéditeur et de chaque modèle de message.
- **Beaucoup d'autres pays** exigent que les identifiants d'expéditeur alphanumériques soient enregistrés au préalable.

Votre fournisseur vous accompagne dans ces démarches. Prévoyez quelques jours avant le lancement.

## Pour le développement et les tests {#for-development-and-tests}

| Driver | À utiliser pour |
|---|---|
| [`log`](/fr/providers/log) | Le développement en local. Écrit chaque message dans le journal Laravel au lieu de l'envoyer. |
| [`fake`](/fr/guide/testing) | Les tests automatisés. Utilisez `Sms::fake()` pour vos assertions. |
| [`failover`](/fr/guide/failover) | L'enchaînement de vrais fournisseurs, pour plus de résilience. |
