# Sparrow SMS

<p class="lead">尼泊尔使用最广泛的短信网关，直连 NTC 和 Ncell 两家运营商。</p>

| | |
|---|---|
| 驱动键名 | `sparrow` |
| 覆盖范围 | 尼泊尔 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [sparrowsms.com](https://sparrowsms.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| 变量 | |
|---|---|
| `SPARROW_TOKEN` | API token |
| `SPARROW_FROM` | 已获批的身份标识（发送方） |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=sparrow
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 所有收件人通过一个请求发出。
- 尼泊尔号码可以带国家代码（`+97798…`），也可以写成 10 位本地手机号（`98…`），两种都接受。
