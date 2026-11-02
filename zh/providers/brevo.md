# Brevo

<p class="lead">前身是 Sendinblue。如果你已经在用 Brevo 发邮件，希望邮件和短信共用一个账号，它是个好选择。</p>

| | |
|---|---|
| 驱动键名 | `brevo` |
| 覆盖范围 | 全球 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 支持 |
| 送达 Webhook | 不支持 |
| 官网 | [www.brevo.com](https://www.brevo.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| 变量 | |
|---|---|
| `BREVO_API_KEY` | API key（v3） |
| `BREVO_SMS_SENDER` | 发送方名称（最多 11 个字符）或号码 |
| `BREVO_SMS_TYPE` | `transactional`（默认）或 `marketing` |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 支持 Brevo 短信模板：用 `->template('12', ['code' => 4821])` 传入模板 ID 及其参数。
- 营销短信必须包含退订方式，在部分国家还受免打扰时段限制。验证码和回执类短信请用 `transactional`。
