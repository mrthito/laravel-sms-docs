# Twilio

<p class="lead">使用最广泛的短信 API。在北美和欧洲送达率极佳，并提供 Messaging Service，用于管理发件号码池和合规事务。</p>

| | |
|---|---|
| 驱动键名 | `twilio` |
| 覆盖范围 | 全球 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.twilio.com](https://www.twilio.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| 变量 | |
|---|---|
| `TWILIO_SID` | Account SID，以 `AC` 开头 |
| `TWILIO_TOKEN` | Auth token |
| `TWILIO_FROM` | 发件号码或字母数字 ID |
| `TWILIO_MESSAGING_SERVICE_SID` | 可选。使用 Messaging Service 代替单个发送方（以 `MG` 开头） |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- `TWILIO_FROM` 和 `TWILIO_MESSAGING_SERVICE_SID` 至少要配置一个。使用 Messaging Service 时，Twilio 会从号码池中挑选最合适的号码，并替你处理退订。
- 如果短信设置了 `from()`，这条短信就使用该发送方，跳过 Messaging Service。
- 试用账号只能给在 Twilio 控制台中验证过的号码发短信。
