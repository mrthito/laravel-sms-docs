# Clickatell

<p class="lead">老牌短信网关，在非洲和新兴市场覆盖很深。使用 Clickatell One API。</p>

| | |
|---|---|
| 驱动键名 | `clickatell` |
| 覆盖范围 | 全球 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.clickatell.com](https://www.clickatell.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| 变量 | |
|---|---|
| `CLICKATELL_API_KEY` | One API 集成的 API key |
| `CLICKATELL_FROM` | 可选的发送方，前提是你的账户已获批一个 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- Clickatell 每个请求最多接受 100 个收件人；超出的部分会自动分批发送。
- 每个收件人单独接收或拒绝，被拒的情况会按号码逐个报告。
