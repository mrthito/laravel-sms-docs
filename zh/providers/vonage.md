# Vonage

<p class="lead">前身是 Nexmo。国际覆盖面广，定价简单，使用 Vonage SMS API。</p>

| | |
|---|---|
| 驱动键名 | `vonage` |
| 覆盖范围 | 全球 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.vonage.com](https://www.vonage.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| 变量 | |
|---|---|
| `VONAGE_KEY` | API key |
| `VONAGE_SECRET` | API secret |
| `VONAGE_FROM` | 发件号码或字母数字 ID |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 含有 GSM 字母表以外字符（例如 emoji 或天城文）的短信会自动以 Unicode 发送，确保原样送达。
- 即使拒绝了短信，Vonage 也会返回 HTTP 200。驱动会读取每条短信的状态，所以被拒时仍会抛出 `DeliveryException`，并附上 Vonage 给出的原因。
