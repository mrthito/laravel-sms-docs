# ClickSend

<p class="lead">在澳大利亚、英国和美国很受欢迎，控制台简洁，每次响应都带有每条短信的状态。</p>

| | |
|---|---|
| 驱动键名 | `clicksend` |
| 覆盖范围 | 全球 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.clicksend.com](https://www.clicksend.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| 变量 | |
|---|---|
| `CLICKSEND_USERNAME` | 你的 ClickSend 用户名 |
| `CLICKSEND_API_KEY` | 控制台中的 API key |
| `CLICKSEND_FROM` | 可选的发送方。留空则使用 ClickSend 的共享号码 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- ClickSend 会逐个报告每个收件人的状态。如果有部分被拒，你会收到一个 `DeliveryException`，其中准确列出这些号码，其余的则放在 `partial` 结果中。
