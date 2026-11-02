# MSG91

<p class="lead">印度领先的短信网关。模板短信使用 MSG91 Flow，DLT 登记由它替你处理。</p>

| | |
|---|---|
| 驱动键名 | `msg91` |
| 覆盖范围 | 印度 |
| 发送方式 | 模板短信：所有收件人合并为一个请求。纯文本：每个收件人一个请求，并行发送。 |
| 模板 | 支持 |
| 送达 Webhook | 不支持 |
| 官网 | [msg91.com](https://msg91.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| 变量 | |
|---|---|
| `MSG91_AUTHKEY` | Auth key |
| `MSG91_SENDER` | 6 个字符、已在 DLT 登记的发送方 ID |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=msg91
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 印度法规（DLT）要求每条商业短信都必须匹配一个已登记的模板。先在 MSG91 中创建一个 Flow，再用 `->template($flowId, ['otp' => 4821])` 发送。所有收件人放在一个请求里，每人各带一份变量。
- 纯文本短信使用 MSG91 的 v2 API，每个请求一个收件人；只有内容与某个 DLT 模板完全一致时，才能送达印度号码。
