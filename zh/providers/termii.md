# Termii

<p class="lead">尼日利亚的热门平台，提供符合 DND（免打扰）规定的通道，同一个账户还能发 WhatsApp。</p>

| | |
|---|---|
| 驱动键名 | `termii` |
| 覆盖范围 | 尼日利亚及非洲 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 支持 |
| 官网 | [termii.com](https://termii.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| 变量 | |
|---|---|
| `TERMII_API_KEY` | API key |
| `TERMII_SENDER_ID` | 已获批的发送方 ID |
| `TERMII_CHANNEL` | `generic`（默认）；开启了免打扰（DND）的号码用 `dnd`；或者 `whatsapp` |
| `TERMII_BASE_URL` | 可选。Termii 控制台中你账户的基础 URL，仅限 HTTPS |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=termii
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 验证码（OTP）这类事务性短信请走 `dnd` 通道。在尼日利亚，`generic` 通道无法送达登记了免打扰的号码。
- Termii 通过请求体中的 API key 认证；驱动只会通过 HTTPS 发送它。

## 送达报告 {#delivery-reports}

把 Termii 的送达报告 URL 指向 `https://your-app.com/laravel-sms/webhook/termii`，并开启 [Webhook](/zh/guide/webhooks)。请求通过 `X-Termii-Signature` 中的 HMAC-SHA512 校验，使用 `TERMII_WEBHOOK_SECRET`。

通过校验的报告会触发 `SmsWebhookReceived` 事件。
