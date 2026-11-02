# Sendchamp

<p class="lead">尼日利亚的通信平台，提供 DND、非 DND 和国际通道。所有收件人通过一个请求发出。</p>

| | |
|---|---|
| 驱动键名 | `sendchamp` |
| 覆盖范围 | 尼日利亚及非洲 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 支持 |
| 官网 | [sendchamp.com](https://sendchamp.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| 变量 | |
|---|---|
| `SENDCHAMP_API_KEY` | Public access key |
| `SENDCHAMP_SENDER_NAME` | 已获批的发送方名称 |
| `SENDCHAMP_ROUTE` | `dnd`（默认）、`non_dnd` 或 `international` |

发一条真实短信验证配置：

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 登录验证码这类对时效敏感的短信，请保持走 `dnd` 通道；它能送达登记了免打扰（DND）的号码。

## 送达报告 {#delivery-reports}

把 Sendchamp 的送达报告 URL 指向 `https://your-app.com/laravel-sms/webhook/sendchamp`，并开启 [Webhook](/zh/guide/webhooks)。请求通过 `X-Sendchamp-Signature` 中的 HMAC-SHA256 校验，使用 `SENDCHAMP_WEBHOOK_SECRET`。

通过校验的报告会触发 `SmsWebhookReceived` 事件。
