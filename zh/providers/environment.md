# 环境变量

<p class="lead">扩展包从 <code>.env</code> 读取的所有配置，都汇总在这里。复制你所用服务商的配置块，填好值，再运行 <code>php artisan sms:test</code> 验证。</p>

## 整体机制 {#how-it-fits-together}

`config/sms.php` 通过 `env()` 读取每一个值，所以整个扩展包完全可以在 `.env` 中配置。记住几条规则，就不会踩坑：

- **只配置你用到的。** 只有通过某家服务商发送时，才会读取它的变量。不用的服务商什么都不用填。
- **包含空格或 `#` 的值要加引号。** 写成 `TWILIO_FROM="ACME Alerts"`，而不是 `TWILIO_FROM=ACME Alerts`。
- **生产环境要缓存配置。** 在服务器上修改 `.env` 后，运行 `php artisan config:cache`，否则旧值会继续生效。
- **别把密钥提交到 git。** 提交一个值为空的 `.env.example`，绝不要提交真正的 `.env`。在 Laravel Cloud、Forge 或 Vapor 上，请在环境设置中配置。

## 通用设置 {#general-settings}

这些设置对所有服务商生效，全部可选。

```ini [.env]
# 默认用哪个服务商发送：服务商键名、"failover" 或 "random"
SMS_PROVIDER=twilio

# 故障转移链，从左到右依次尝试（SMS_PROVIDER=failover 时使用）
SMS_FAILOVER_DRIVERS=twilio,vonage

# 让每次 send() 都放进队列，而不是立即发送
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # 队列的 retry_after 要大于这个值

# 调用服务商的 HTTP 请求
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # 逐个发送型服务商的并行请求数

# Log 驱动（仅限开发环境）
SMS_LOG_CHANNEL=
```

每一项的详细作用见[配置](/zh/reference/configuration)。

## 全球服务商 {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID，以 AC 开头
TWILIO_TOKEN=                  # Auth token
TWILIO_FROM=                   # 发件号码或字母数字 ID
TWILIO_MESSAGING_SERVICE_SID=  # 可选。使用 Messaging Service 代替单个发送方（以 MG 开头）
```

[Twilio 指南 →](/zh/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # API key
VONAGE_SECRET=  # API secret
VONAGE_FROM=    # 发件号码或字母数字 ID
```

[Vonage 指南 →](/zh/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # SMS 控制台中的 Service plan ID
SINCH_API_TOKEN=        # 该 service plan 的 API token
SINCH_FROM=             # 发件号码或字母数字 ID
SINCH_REGION=           # us（默认）、eu、au、br 或 ca；必须与账号所在区域一致
```

[Sinch 指南 →](/zh/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # 工作区 API key，以 bk_ 开头
BIRD_FROM=      # 发件号码或字母数字 ID
BIRD_REGION=    # us1（默认）或 eu1；必须与 key 匹配
BIRD_CATEGORY=  # transactional（默认）、marketing、authentication 或 service
```

[Bird 指南 →](/zh/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth token
PLIVO_FROM=          # 发件号码或字母数字 ID
PLIVO_LOG_MESSAGES=  # 可选，默认 false。是否允许 Plivo 在其日志中保存短信内容和号码
```

[Plivo 指南 →](/zh/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # API key（v2）
TELNYX_FROM=                  # 发件号码
TELNYX_MESSAGING_PROFILE_ID=  # 可选。使用 messaging profile 及其号码池，代替单个发送方
```

[Telnyx 指南 →](/zh/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # API key
INFOBIP_SENDER=    # 发件号码或字母数字 ID
INFOBIP_BASE_URL=  # Infobip 门户中你的专属基础 URL，例如 https://xyz123.api.infobip.com
```

[Infobip 指南 →](/zh/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # 你的 ClickSend 用户名
CLICKSEND_API_KEY=   # 控制台中的 API key
CLICKSEND_FROM=      # 可选的发送方。留空则使用 ClickSend 的共享号码
```

[ClickSend 指南 →](/zh/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # One API 集成的 API key
CLICKATELL_FROM=     # 可选的发送方，前提是你的账户已获批一个
```

[Clickatell 指南 →](/zh/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # API key（v3）
BREVO_SMS_SENDER=  # 发送方名称（最多 11 个字符）或号码
BREVO_SMS_TYPE=    # transactional（默认）或 marketing
```

[Brevo 指南 →](/zh/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # Account ID
BANDWIDTH_APPLICATION_ID=  # 关联到你号码的 Messaging 应用
BANDWIDTH_CLIENT_ID=       # OAuth client ID
BANDWIDTH_CLIENT_SECRET=   # OAuth client secret
BANDWIDTH_FROM=            # 分配给该应用的 Bandwidth 号码
```

[Bandwidth 指南 →](/zh/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # REST API ID
SENDPULSE_CLIENT_SECRET=  # REST API secret
SENDPULSE_SENDER=         # 已获批的发送方名称（最多 11 个字符）
```

[SendPulse 指南 →](/zh/providers/sendpulse)

### Amazon SNS {#aws-sns}

需要先安装 AWS SDK：`composer require aws/aws-sdk-php`。

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # 发送所用的区域，例如 us-east-1
AWS_ACCESS_KEY_ID=      # 可选。留空则使用默认凭据链
AWS_SECRET_ACCESS_KEY=  # 可选，与上面的 key 配套使用
AWS_SNS_SENDER_ID=      # 可选的字母数字发送方 ID
AWS_SNS_SMS_TYPE=       # Transactional（默认）或 Promotional
```

[Amazon SNS 指南 →](/zh/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # WhatsApp Manager 中的 Phone number ID
WHATSAPP_ACCESS_TOKEN=          # 永久有效的系统用户 access token
WHATSAPP_API_VERSION=           # 可选，默认 v21.0
WHATSAPP_TEMPLATE_LANGUAGE=     # 可选，默认 en。模板的语言代码，例如 en_US
WHATSAPP_DEFAULT_COUNTRY_CODE=  # 可选。号码没写国家代码时自动补上
```

[WhatsApp 指南 →](/zh/providers/whatsapp)

## 区域服务商 {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth key
MSG91_SENDER=   # 6 个字符、已在 DLT 登记的发送方 ID
```

[MSG91 指南 →](/zh/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # API token
SPARROW_FROM=   # 已获批的身份标识（发送方）
```

[Sparrow SMS 指南 →](/zh/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # API key
TERMII_SENDER_ID=  # 已获批的发送方 ID
TERMII_CHANNEL=    # generic（默认）；开启了免打扰（DND）的号码用 dnd；或者 whatsapp
TERMII_BASE_URL=   # 可选。Termii 控制台中你账户的基础 URL，仅限 HTTPS
```

[Termii 指南 →](/zh/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # Public access key
SENDCHAMP_SENDER_NAME=  # 已获批的发送方名称
SENDCHAMP_ROUTE=        # dnd（默认）、non_dnd 或 international
```

[Sendchamp 指南 →](/zh/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # API key
AFRICASTALKING_USERNAME=  # 应用用户名（测试时为 sandbox）
AFRICASTALKING_FROM=      # 可选的发送方 ID 或短号码
AFRICASTALKING_SANDBOX=   # 设为 true 时使用沙盒 API
```

[Africa's Talking 指南 →](/zh/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # API token ID
BULKSMS_TOKEN_SECRET=  # API token secret
BULKSMS_FROM=          # 可选的发送方，前提是你的账户有一个
```

[BulkSMS 指南 →](/zh/providers/bulksms)

## Webhook 密钥 {#webhook-secrets}

只有接收送达报告时才需要。每个密钥对其服务商都是必填的：缺了它，该服务商的 Webhook 会被全部拒绝。详见 [Webhook 回调](/zh/guide/webhooks)。

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # 任意随机字符串；同时也要填进 Meta 控制台
WHATSAPP_WEBHOOK_SECRET=        # 你的 Meta 应用密钥
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # 同时以 ?token= 的形式加到回调 URL 中
```

需要自己设定的密钥，可以用 `php -r "echo bin2hex(random_bytes(24));"` 生成。

## 完整示例 {#a-complete-example}

一套贴近实际的生产配置：Twilio 打头，Vonage 备用，全部走队列，并接收 WhatsApp 送达报告。

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

然后逐一验证链上的每家服务商：

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
