# Variables d'environnement

<p class="lead">Tous les réglages que le package lit dans le <code>.env</code>, réunis au même endroit. Copiez le bloc de votre fournisseur, renseignez les valeurs, puis lancez <code>php artisan sms:test</code> pour les vérifier.</p>

## Comment tout s'articule {#how-it-fits-together}

`config/sms.php` lit chaque valeur avec `env()` : vous configurez donc entièrement le package depuis le `.env`. Quelques règles rendent l'exercice indolore :

- **Ne définissez que ce que vous utilisez.** Les variables d'un fournisseur ne sont lues que lorsque vous envoyez par son intermédiaire. Les fournisseurs inutilisés n'ont besoin de rien.
- **Mettez entre guillemets les valeurs qui contiennent des espaces ou un `#`.** `TWILIO_FROM="ACME Alerts"`, et non `TWILIO_FROM=ACME Alerts`.
- **Mettez la configuration en cache en production.** Après avoir modifié le `.env` sur un serveur, lancez `php artisan config:cache`, faute de quoi les anciennes valeurs restent en vigueur.
- **Gardez les secrets hors de git.** Versionnez un `.env.example` aux valeurs vides, jamais le vrai `.env`. Sur Laravel Cloud, Forge ou Vapor, définissez-les plutôt dans les réglages d'environnement.

## Réglages généraux {#general-settings}

Ils s'appliquent à tous les fournisseurs. Tous sont facultatifs.

```ini [.env]
# Fournisseur utilisé par défaut : une clé de fournisseur, "failover" ou "random"
SMS_PROVIDER=twilio

# Chaîne de basculement, essayée de gauche à droite (utilisée quand SMS_PROVIDER=failover)
SMS_FAILOVER_DRIVERS=twilio,vonage

# Mettre chaque send() en file d'attente au lieu d'envoyer immédiatement
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # le retry_after de votre file doit rester supérieur à cette valeur

# Appels HTTP aux fournisseurs
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # requêtes parallèles pour les fournisseurs à un destinataire par requête

# Driver log (développement uniquement)
SMS_LOG_CHANNEL=
```

La page [Configuration](/fr/reference/configuration) détaille le rôle de chacun.

## Fournisseurs internationaux {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID, commence par AC
TWILIO_TOKEN=                  # Auth token
TWILIO_FROM=                   # Numéro d'expéditeur ou identifiant alphanumérique
TWILIO_MESSAGING_SERVICE_SID=  # Facultatif. Utilise un Messaging Service au lieu d'un expéditeur unique (commence par MG)
```

[Guide Twilio →](/fr/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # Clé d'API
VONAGE_SECRET=  # Secret d'API
VONAGE_FROM=    # Numéro d'expéditeur ou identifiant alphanumérique
```

[Guide Vonage →](/fr/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # Identifiant du service plan, depuis le tableau de bord SMS
SINCH_API_TOKEN=        # Jeton d'API de ce service plan
SINCH_FROM=             # Numéro d'expéditeur ou identifiant alphanumérique
SINCH_REGION=           # us (par défaut), eu, au, br ou ca ; doit correspondre à la région de votre compte
```

[Guide Sinch →](/fr/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # Clé d'API du workspace, commence par bk_
BIRD_FROM=      # Numéro d'expéditeur ou identifiant alphanumérique
BIRD_REGION=    # us1 (par défaut) ou eu1 ; doit correspondre à votre clé
BIRD_CATEGORY=  # transactional (par défaut), marketing, authentication ou service
```

[Guide Bird →](/fr/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth token
PLIVO_FROM=          # Numéro d'expéditeur ou identifiant alphanumérique
PLIVO_LOG_MESSAGES=  # Facultatif, false par défaut. Indique si Plivo conserve le contenu des messages et les numéros dans ses journaux
```

[Guide Plivo →](/fr/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # Clé d'API (v2)
TELNYX_FROM=                  # Numéro d'expéditeur
TELNYX_MESSAGING_PROFILE_ID=  # Facultatif. Utilise un messaging profile et son pool de numéros au lieu d'un expéditeur unique
```

[Guide Telnyx →](/fr/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # Clé d'API
INFOBIP_SENDER=    # Numéro d'expéditeur ou identifiant alphanumérique
INFOBIP_BASE_URL=  # Votre URL de base personnelle, indiquée sur le portail Infobip, par exemple https://xyz123.api.infobip.com
```

[Guide Infobip →](/fr/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # Votre nom d'utilisateur ClickSend
CLICKSEND_API_KEY=   # Clé d'API, depuis le tableau de bord
CLICKSEND_FROM=      # Expéditeur facultatif. Laissez vide pour utiliser les numéros partagés de ClickSend
```

[Guide ClickSend →](/fr/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # Clé d'API d'une intégration One API
CLICKATELL_FROM=     # Expéditeur facultatif, si votre compte en a un d'approuvé
```

[Guide Clickatell →](/fr/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # Clé d'API (v3)
BREVO_SMS_SENDER=  # Nom d'expéditeur (11 caractères maximum) ou numéro
BREVO_SMS_TYPE=    # transactional (par défaut) ou marketing
```

[Guide Brevo →](/fr/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # Identifiant du compte
BANDWIDTH_APPLICATION_ID=  # Application de messagerie liée à votre numéro
BANDWIDTH_CLIENT_ID=       # Client ID OAuth
BANDWIDTH_CLIENT_SECRET=   # Client secret OAuth
BANDWIDTH_FROM=            # Un numéro Bandwidth attribué à cette application
```

[Guide Bandwidth →](/fr/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # ID de l'API REST
SENDPULSE_CLIENT_SECRET=  # Secret de l'API REST
SENDPULSE_SENDER=         # Nom d'expéditeur approuvé (11 caractères maximum)
```

[Guide SendPulse →](/fr/providers/sendpulse)

### Amazon SNS {#aws-sns}

Nécessite d'abord le SDK AWS : `composer require aws/aws-sdk-php`.

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # Région d'envoi, par exemple us-east-1
AWS_ACCESS_KEY_ID=      # Facultatif. Omettez-la pour utiliser la chaîne d'identifiants par défaut
AWS_SECRET_ACCESS_KEY=  # Facultatif, avec la clé ci-dessus
AWS_SNS_SENDER_ID=      # Identifiant d'expéditeur alphanumérique facultatif
AWS_SNS_SMS_TYPE=       # Transactional (par défaut) ou Promotional
```

[Guide Amazon SNS →](/fr/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # Phone number ID, depuis WhatsApp Manager
WHATSAPP_ACCESS_TOKEN=          # Un jeton d'accès permanent d'utilisateur système
WHATSAPP_API_VERSION=           # Facultatif, v21.0 par défaut
WHATSAPP_TEMPLATE_LANGUAGE=     # Facultatif, en par défaut. Code de langue de vos modèles, par exemple en_US
WHATSAPP_DEFAULT_COUNTRY_CODE=  # Facultatif. Ajouté aux numéros écrits sans indicatif pays
```

[Guide WhatsApp →](/fr/providers/whatsapp)

## Fournisseurs régionaux {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth key
MSG91_SENDER=   # Identifiant d'expéditeur de six caractères, enregistré sur DLT
```

[Guide MSG91 →](/fr/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # Jeton d'API
SPARROW_FROM=   # Votre identité approuvée (expéditeur)
```

[Guide Sparrow SMS →](/fr/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # Clé d'API
TERMII_SENDER_ID=  # Identifiant d'expéditeur approuvé
TERMII_CHANNEL=    # generic (par défaut), dnd pour les numéros inscrits au Do-Not-Disturb, ou whatsapp
TERMII_BASE_URL=   # Facultatif. L'URL de base de votre compte, depuis le tableau de bord Termii, HTTPS uniquement
```

[Guide Termii →](/fr/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # Clé d'accès publique
SENDCHAMP_SENDER_NAME=  # Nom d'expéditeur approuvé
SENDCHAMP_ROUTE=        # dnd (par défaut), non_dnd ou international
```

[Guide Sendchamp →](/fr/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # Clé d'API
AFRICASTALKING_USERNAME=  # Nom d'utilisateur de l'application (sandbox pendant les tests)
AFRICASTALKING_FROM=      # Identifiant d'expéditeur ou short code facultatif
AFRICASTALKING_SANDBOX=   # true pour utiliser l'API sandbox
```

[Guide Africa's Talking →](/fr/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # Identifiant du jeton d'API
BULKSMS_TOKEN_SECRET=  # Secret du jeton d'API
BULKSMS_FROM=          # Expéditeur facultatif, si votre compte en a un
```

[Guide BulkSMS →](/fr/providers/bulksms)

## Secrets des webhooks {#webhook-secrets}

Uniquement nécessaires si vous recevez des accusés de réception. Chacun est obligatoire pour son fournisseur : sans lui, les webhooks de ce fournisseur sont rejetés. Voir [Webhooks](/fr/guide/webhooks).

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # n'importe quelle chaîne aléatoire ; à saisir aussi dans le tableau de bord Meta
WHATSAPP_WEBHOOK_SECRET=        # le secret de votre application Meta
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # également ajouté à l'URL de callback sous la forme ?token=
```

Pour les secrets que vous choisissez vous-même, générez-les avec `php -r "echo bin2hex(random_bytes(24));"`.

## Un exemple complet {#a-complete-example}

Une configuration de production réaliste : Twilio en premier, Vonage en secours, tout en file d'attente, et les accusés de réception WhatsApp.

```ini [.env]
SMS_PROVIDER=failover
SMS_FAILOVER_DRIVERS=twilio,vonage

SMS_QUEUE=true
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=ACME

SMS_WEBHOOKS_ENABLED=true
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_WEBHOOK_SECRET=
```

Vérifiez ensuite chaque fournisseur de la chaîne :

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
