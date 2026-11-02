# WhatsApp

<p class="lead">用发短信的同一套 API，通过 Meta 的 Cloud API 发送 WhatsApp 消息。支持自由文本和已审核的模板。</p>

| | |
|---|---|
| 驱动键名 | `whatsapp` |
| 覆盖范围 | 全球 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 支持 |
| 送达 Webhook | 支持 |
| 官网 | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| 变量 | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Manager 中的 Phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | 永久有效的系统用户 access token |
| `WHATSAPP_API_VERSION` | 可选，默认 `v21.0` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | 可选，默认 `en`。模板的语言代码，例如 `en_US` |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | 可选。号码没写国家代码时自动补上 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- WhatsApp 只允许在客户最后一条消息后的 24 小时内发送自由文本。要主动发起会话，请发送已审核的模板：`->template('order_update', ['Ana', '#4821'])`。变量会按顺序填入模板正文的参数。
- 请使用系统用户 token，不要用入门页面上的临时 token，它一天后就会过期。

## 送达报告 {#delivery-reports}

把 WhatsApp 的送达报告 URL 指向 `https://your-app.com/laravel-sms/webhook/whatsapp`，并开启 [Webhook](/zh/guide/webhooks)。请求通过 `X-Hub-Signature-256` HMAC 校验（`WHATSAPP_WEBHOOK_SECRET`），Meta 的订阅校验则使用 `WHATSAPP_VERIFY_TOKEN`。

通过校验的报告会触发 `SmsWebhookReceived` 事件。
