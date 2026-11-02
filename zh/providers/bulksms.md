# BulkSMS

<p class="lead">简单直接的全球短信网关，所有收件人通过一个 JSON 请求发出。</p>

| | |
|---|---|
| 驱动键名 | `bulksms` |
| 覆盖范围 | 全球，南部非洲最强 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 支持 |
| 官网 | [www.bulksms.com](https://www.bulksms.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| 变量 | |
|---|---|
| `BULKSMS_TOKEN_ID` | API token ID |
| `BULKSMS_TOKEN_SECRET` | API token secret |
| `BULKSMS_FROM` | 可选的发送方，前提是你的账户有一个 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 在 *Settings → API Tokens* 下创建 token；驱动会用它进行 HTTP Basic 认证。

## 送达报告 {#delivery-reports}

把 BulkSMS 的送达报告 URL 指向 `https://your-app.com/laravel-sms/webhook/bulksms`，并开启 [Webhook](/zh/guide/webhooks)。请求通过 `X-BulkSMS-Signature` 中的 HMAC-SHA256 校验，使用 `BULKSMS_WEBHOOK_SECRET`。

通过校验的报告会触发 `SmsWebhookReceived` 事件。
