# Africa's Talking

<p class="lead">与 20 多个非洲国家的运营商直连，并提供免费的开发沙盒。</p>

| | |
|---|---|
| 驱动键名 | `africastalking` |
| 覆盖范围 | 泛非洲 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 支持 |
| 官网 | [africastalking.com](https://africastalking.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| 变量 | |
|---|---|
| `AFRICASTALKING_API_KEY` | API key |
| `AFRICASTALKING_USERNAME` | 应用用户名（测试时为 `sandbox`） |
| `AFRICASTALKING_FROM` | 可选的发送方 ID 或短号码 |
| `AFRICASTALKING_SANDBOX` | 设为 `true` 时使用沙盒 API |

发一条真实短信验证配置：

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 在沙盒模式下，短信会出现在 Africa's Talking 的模拟器里，而不会发到真实手机上。`AFRICASTALKING_USERNAME=sandbox` 和 `AFRICASTALKING_SANDBOX=true` 要一起设置。
- Africa's Talking 会报告每个收件人的状态。被拒的号码（例如因余额不足）会列在 `DeliveryException` 中。

## 送达报告 {#delivery-reports}

把 Africa's Talking 的送达报告 URL 指向 `https://your-app.com/laravel-sms/webhook/africastalking`，并开启 [Webhook](/zh/guide/webhooks)。请求通过回调 URL 中的 `?token=` 密钥校验，使用 `AFRICASTALKING_WEBHOOK_SECRET`（Africa's Talking 不对回调签名）。

通过校验的报告会触发 `SmsWebhookReceived` 事件。
