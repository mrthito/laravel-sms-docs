# Variables de entorno

<p class="lead">Todos los ajustes que el paquete lee del <code>.env</code>, en un solo sitio. Copia el bloque de tu proveedor, rellena los valores y ejecuta <code>php artisan sms:test</code> para comprobarlos.</p>

## Cómo encaja todo {#how-it-fits-together}

`config/sms.php` lee cada valor con `env()`, así que el paquete se configura por completo desde el `.env`. Unas pocas reglas te lo ponen fácil:

- **Define solo lo que uses.** Las variables de un proveedor solo se leen cuando envías a través de él. Los proveedores que no usas no necesitan nada.
- **Pon entre comillas los valores con espacios o `#`.** `TWILIO_FROM="ACME Alerts"`, no `TWILIO_FROM=ACME Alerts`.
- **Usa la caché en producción.** Después de cambiar el `.env` en un servidor, ejecuta `php artisan config:cache`; si no, seguirán vigentes los valores antiguos.
- **Deja los secretos fuera de git.** Sube a git un `.env.example` con los valores vacíos, nunca el `.env` real. En Laravel Cloud, Forge o Vapor, defínelos en los ajustes de entorno.

## Ajustes generales {#general-settings}

Se aplican a todos los proveedores. Todos son opcionales.

```ini [.env]
# Qué proveedor envía por defecto: la clave de un proveedor, "failover" o "random"
SMS_PROVIDER=twilio

# Cadena de failover, de izquierda a derecha (se usa cuando SMS_PROVIDER=failover)
SMS_FAILOVER_DRIVERS=twilio,vonage

# Encolar cada send() en lugar de enviar de inmediato
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # el retry_after de tu cola debe ser mayor que esto

# Llamadas HTTP a los proveedores
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # peticiones en paralelo para proveedores de un destinatario por petición

# Driver de log (solo para desarrollo)
SMS_LOG_CHANNEL=
```

En [Configuración](/es/reference/configuration) se explica en detalle qué hace cada uno.

## Proveedores globales {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID, empieza por AC
TWILIO_TOKEN=                  # Auth token
TWILIO_FROM=                   # Número remitente o ID alfanumérico
TWILIO_MESSAGING_SERVICE_SID=  # Opcional. Usa un Messaging Service en lugar de un único remitente (empieza por MG)
```

[Guía de Twilio →](/es/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # API key
VONAGE_SECRET=  # API secret
VONAGE_FROM=    # Número remitente o ID alfanumérico
```

[Guía de Vonage →](/es/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # ID del service plan, del panel de SMS
SINCH_API_TOKEN=        # API token de ese service plan
SINCH_FROM=             # Número remitente o ID alfanumérico
SINCH_REGION=           # us (predeterminado), eu, au, br o ca; debe coincidir con la región de tu cuenta
```

[Guía de Sinch →](/es/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # API key del workspace, empieza por bk_
BIRD_FROM=      # Número remitente o ID alfanumérico
BIRD_REGION=    # us1 (predeterminado) o eu1; debe coincidir con tu key
BIRD_CATEGORY=  # transactional (predeterminado), marketing, authentication o service
```

[Guía de Bird →](/es/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth token
PLIVO_FROM=          # Número remitente o ID alfanumérico
PLIVO_LOG_MESSAGES=  # Opcional, false por defecto. Si Plivo guarda en sus logs el contenido de los mensajes y los números
```

[Guía de Plivo →](/es/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # API key (v2)
TELNYX_FROM=                  # Número remitente
TELNYX_MESSAGING_PROFILE_ID=  # Opcional. Usa un messaging profile y su grupo de números en lugar de un único remitente
```

[Guía de Telnyx →](/es/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # API key
INFOBIP_SENDER=    # Número remitente o ID alfanumérico
INFOBIP_BASE_URL=  # Tu URL base personal del portal de Infobip, por ejemplo https://xyz123.api.infobip.com
```

[Guía de Infobip →](/es/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # Tu nombre de usuario de ClickSend
CLICKSEND_API_KEY=   # API key del panel
CLICKSEND_FROM=      # Remitente opcional. Déjalo vacío para usar los números compartidos de ClickSend
```

[Guía de ClickSend →](/es/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # API key de una integración One API
CLICKATELL_FROM=     # Remitente opcional, si tu cuenta tiene uno aprobado
```

[Guía de Clickatell →](/es/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # API key (v3)
BREVO_SMS_SENDER=  # Nombre del remitente (hasta 11 caracteres) o número
BREVO_SMS_TYPE=    # transactional (predeterminado) o marketing
```

[Guía de Brevo →](/es/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # Account ID
BANDWIDTH_APPLICATION_ID=  # Aplicación de mensajería vinculada a tu número
BANDWIDTH_CLIENT_ID=       # Client ID de OAuth
BANDWIDTH_CLIENT_SECRET=   # Client secret de OAuth
BANDWIDTH_FROM=            # Un número de Bandwidth asignado a esa aplicación
```

[Guía de Bandwidth →](/es/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # ID de la REST API
SENDPULSE_CLIENT_SECRET=  # Secret de la REST API
SENDPULSE_SENDER=         # Nombre de remitente aprobado (hasta 11 caracteres)
```

[Guía de SendPulse →](/es/providers/sendpulse)

### Amazon SNS {#aws-sns}

Antes necesitas el SDK de AWS: `composer require aws/aws-sdk-php`.

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # Región desde la que se envía, por ejemplo us-east-1
AWS_ACCESS_KEY_ID=      # Opcional. Si no la indicas, se usa la cadena de credenciales predeterminada
AWS_SECRET_ACCESS_KEY=  # Opcional, junto con la anterior
AWS_SNS_SENDER_ID=      # Remitente alfanumérico opcional
AWS_SNS_SMS_TYPE=       # Transactional (predeterminado) o Promotional
```

[Guía de Amazon SNS →](/es/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # Phone number ID del WhatsApp Manager
WHATSAPP_ACCESS_TOKEN=          # Un token de acceso permanente de usuario del sistema
WHATSAPP_API_VERSION=           # Opcional, v21.0 por defecto
WHATSAPP_TEMPLATE_LANGUAGE=     # Opcional, en por defecto. Código de idioma de tus plantillas, por ejemplo en_US
WHATSAPP_DEFAULT_COUNTRY_CODE=  # Opcional. Se añade a los números escritos sin código de país
```

[Guía de WhatsApp →](/es/providers/whatsapp)

## Proveedores regionales {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth key
MSG91_SENDER=   # Remitente de seis caracteres registrado en DLT
```

[Guía de MSG91 →](/es/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # API token
SPARROW_FROM=   # Tu identidad aprobada (remitente)
```

[Guía de Sparrow SMS →](/es/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # API key
TERMII_SENDER_ID=  # Remitente aprobado
TERMII_CHANNEL=    # generic (predeterminado), dnd para números inscritos en Do-Not-Disturb, o whatsapp
TERMII_BASE_URL=   # Opcional. La URL base de tu cuenta, del panel de Termii; solo HTTPS
```

[Guía de Termii →](/es/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # Public access key
SENDCHAMP_SENDER_NAME=  # Nombre de remitente aprobado
SENDCHAMP_ROUTE=        # dnd (predeterminado), non_dnd o international
```

[Guía de Sendchamp →](/es/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # API key
AFRICASTALKING_USERNAME=  # Nombre de usuario de la app (sandbox mientras haces pruebas)
AFRICASTALKING_FROM=      # Remitente o short code opcional
AFRICASTALKING_SANDBOX=   # true para usar la API del sandbox
```

[Guía de Africa's Talking →](/es/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # ID del API token
BULKSMS_TOKEN_SECRET=  # Secret del API token
BULKSMS_FROM=          # Remitente opcional, si tu cuenta tiene uno
```

[Guía de BulkSMS →](/es/providers/bulksms)

## Secretos de los webhooks {#webhook-secrets}

Solo los necesitas si recibes informes de entrega. Cada uno es obligatorio para su proveedor: sin él, los webhooks de ese proveedor se rechazan. Consulta [Webhooks](/es/guide/webhooks).

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # cualquier cadena aleatoria; también se introduce en el panel de Meta
WHATSAPP_WEBHOOK_SECRET=        # el secreto de tu app de Meta
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # también se añade a la URL de callback como ?token=
```

Para los secretos que eliges tú, genera un valor con `php -r "echo bin2hex(random_bytes(24));"`.

## Un ejemplo completo {#a-complete-example}

Una configuración de producción realista: Twilio primero, Vonage de respaldo, todo en cola y los informes de entrega de WhatsApp.

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

Después comprueba cada proveedor de la cadena:

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
