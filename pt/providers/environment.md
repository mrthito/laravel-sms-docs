# Variáveis de ambiente

<p class="lead">Todas as configurações que o pacote lê do <code>.env</code>, em um só lugar. Copie o bloco do seu provedor, preencha os valores e rode <code>php artisan sms:test</code> para conferir.</p>

## Como tudo se encaixa {#how-it-fits-together}

O `config/sms.php` lê cada valor com `env()`, então você configura o pacote inteiro pelo `.env`. Algumas regras deixam isso tranquilo:

- **Defina só o que você usa.** As variáveis de um provedor só são lidas quando você envia por ele. Provedores que você não usa não precisam de nada.
- **Use aspas em valores com espaços ou `#`.** `TWILIO_FROM="ACME Alerts"`, e não `TWILIO_FROM=ACME Alerts`.
- **Faça cache em produção.** Depois de alterar o `.env` em um servidor, rode `php artisan config:cache`, senão os valores antigos continuam valendo.
- **Mantenha os segredos fora do git.** Faça commit de um `.env.example` com os valores vazios, nunca do `.env` de verdade. No Laravel Cloud, no Forge ou no Vapor, defina-os nas configurações de ambiente.

## Configurações gerais {#general-settings}

Valem para todos os provedores. Todas são opcionais.

```ini [.env]
# Provedor que envia por padrão: a chave de um provedor, "failover" ou "random"
SMS_PROVIDER=twilio

# Cadeia de failover, tentada da esquerda para a direita (usada quando SMS_PROVIDER=failover)
SMS_FAILOVER_DRIVERS=twilio,vonage

# Coloca todo send() na fila em vez de enviar na hora
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # mantenha o retry_after da sua fila acima deste valor

# Chamadas HTTP aos provedores
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # requisições em paralelo para provedores de um destinatário por requisição

# Driver de log (só para desenvolvimento)
SMS_LOG_CHANNEL=
```

Veja em [Configuração](/pt/reference/configuration) o que cada uma faz em detalhes.

## Provedores globais {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID, começa com AC
TWILIO_TOKEN=                  # Auth token
TWILIO_FROM=                   # Número remetente ou ID alfanumérico
TWILIO_MESSAGING_SERVICE_SID=  # Opcional. Usa um Messaging Service em vez de um único remetente (começa com MG)
```

[Guia da Twilio →](/pt/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # API key
VONAGE_SECRET=  # API secret
VONAGE_FROM=    # Número remetente ou ID alfanumérico
```

[Guia da Vonage →](/pt/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # Service plan ID do painel de SMS
SINCH_API_TOKEN=        # API token desse service plan
SINCH_FROM=             # Número remetente ou ID alfanumérico
SINCH_REGION=           # us (padrão), eu, au, br ou ca; precisa ser a região onde sua conta está
```

[Guia da Sinch →](/pt/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # API key do workspace, começa com bk_
BIRD_FROM=      # Número remetente ou ID alfanumérico
BIRD_REGION=    # us1 (padrão) ou eu1; precisa bater com a sua chave
BIRD_CATEGORY=  # transactional (padrão), marketing, authentication ou service
```

[Guia da Bird →](/pt/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth token
PLIVO_FROM=          # Número remetente ou ID alfanumérico
PLIVO_LOG_MESSAGES=  # Opcional, padrão false. Define se a Plivo guarda o conteúdo das mensagens e os números nos logs dela
```

[Guia da Plivo →](/pt/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # API key (v2)
TELNYX_FROM=                  # Número remetente
TELNYX_MESSAGING_PROFILE_ID=  # Opcional. Usa um messaging profile e o pool de números dele em vez de um único remetente
```

[Guia da Telnyx →](/pt/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # API key
INFOBIP_SENDER=    # Número remetente ou ID alfanumérico
INFOBIP_BASE_URL=  # Sua base URL pessoal do portal da Infobip, como https://xyz123.api.infobip.com
```

[Guia da Infobip →](/pt/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # Seu usuário da ClickSend
CLICKSEND_API_KEY=   # API key do painel
CLICKSEND_FROM=      # Remetente opcional. Deixe vazio para usar os números compartilhados da ClickSend
```

[Guia da ClickSend →](/pt/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # API key de uma integração One API
CLICKATELL_FROM=     # Remetente opcional, se a sua conta tiver um aprovado
```

[Guia da Clickatell →](/pt/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # API key (v3)
BREVO_SMS_SENDER=  # Nome do remetente (até 11 caracteres) ou número
BREVO_SMS_TYPE=    # transactional (padrão) ou marketing
```

[Guia da Brevo →](/pt/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # Account ID
BANDWIDTH_APPLICATION_ID=  # Aplicação de mensagens vinculada ao seu número
BANDWIDTH_CLIENT_ID=       # OAuth client ID
BANDWIDTH_CLIENT_SECRET=   # OAuth client secret
BANDWIDTH_FROM=            # Um número da Bandwidth atribuído a essa aplicação
```

[Guia da Bandwidth →](/pt/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # ID da REST API
SENDPULSE_CLIENT_SECRET=  # Secret da REST API
SENDPULSE_SENDER=         # Nome de remetente aprovado (até 11 caracteres)
```

[Guia da SendPulse →](/pt/providers/sendpulse)

### Amazon SNS {#aws-sns}

Primeiro, instale o SDK da AWS: `composer require aws/aws-sdk-php`.

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # Região de onde enviar, como us-east-1
AWS_ACCESS_KEY_ID=      # Opcional. Omita para usar a cadeia de credenciais padrão
AWS_SECRET_ACCESS_KEY=  # Opcional, junto com a chave acima
AWS_SNS_SENDER_ID=      # Sender ID alfanumérico opcional
AWS_SNS_SMS_TYPE=       # Transactional (padrão) ou Promotional
```

[Guia do Amazon SNS →](/pt/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # Phone number ID do WhatsApp Manager
WHATSAPP_ACCESS_TOKEN=          # Um access token permanente de system user
WHATSAPP_API_VERSION=           # Opcional, padrão v21.0
WHATSAPP_TEMPLATE_LANGUAGE=     # Opcional, padrão en. Código de idioma dos seus templates, como en_US
WHATSAPP_DEFAULT_COUNTRY_CODE=  # Opcional. Adicionado aos números escritos sem código do país
```

[Guia do WhatsApp →](/pt/providers/whatsapp)

## Provedores regionais {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth key
MSG91_SENDER=   # Sender ID de seis caracteres registrado na DLT
```

[Guia do MSG91 →](/pt/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # API token
SPARROW_FROM=   # Sua identidade aprovada (remetente)
```

[Guia do Sparrow SMS →](/pt/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # API key
TERMII_SENDER_ID=  # Sender ID aprovado
TERMII_CHANNEL=    # generic (padrão), dnd para números em Do-Not-Disturb, ou whatsapp
TERMII_BASE_URL=   # Opcional. A base URL da sua conta no painel da Termii, só HTTPS
```

[Guia da Termii →](/pt/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # Public access key
SENDCHAMP_SENDER_NAME=  # Nome de remetente aprovado
SENDCHAMP_ROUTE=        # dnd (padrão), non_dnd ou international
```

[Guia da Sendchamp →](/pt/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # API key
AFRICASTALKING_USERNAME=  # Username do app (sandbox durante os testes)
AFRICASTALKING_FROM=      # Sender ID ou short code opcional
AFRICASTALKING_SANDBOX=   # true para usar a API de sandbox
```

[Guia da Africa's Talking →](/pt/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # ID do API token
BULKSMS_TOKEN_SECRET=  # Secret do API token
BULKSMS_FROM=          # Remetente opcional, se a sua conta tiver um
```

[Guia da BulkSMS →](/pt/providers/bulksms)

## Segredos dos webhooks {#webhook-secrets}

Só são necessários se você recebe relatórios de entrega. Cada um é obrigatório para o seu provedor: sem ele, os webhooks daquele provedor são recusados. Veja [Webhooks](/pt/guide/webhooks).

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # qualquer string aleatória; também informada no painel da Meta
WHATSAPP_WEBHOOK_SECRET=        # o app secret do seu app na Meta
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # também vai na URL de callback como ?token=
```

Gere os segredos que você mesmo escolhe com `php -r "echo bin2hex(random_bytes(24));"`.

## Um exemplo completo {#a-complete-example}

Uma configuração de produção realista: Twilio primeiro, Vonage como reserva, tudo na fila e relatórios de entrega do WhatsApp.

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

Depois, teste cada provedor da cadeia:

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
