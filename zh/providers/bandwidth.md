# Bandwidth

<p class="lead">拥有自建网络的美国运营商，许多大型通信平台都在用它。通过 OAuth 2.0 认证。</p>

| | |
|---|---|
| 驱动键名 | `bandwidth` |
| 覆盖范围 | 美国和加拿大 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.bandwidth.com](https://www.bandwidth.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| 变量 | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | Account ID |
| `BANDWIDTH_APPLICATION_ID` | 关联到你号码的 Messaging 应用 |
| `BANDWIDTH_CLIENT_ID` | OAuth client ID |
| `BANDWIDTH_CLIENT_SECRET` | OAuth client secret |
| `BANDWIDTH_FROM` | 分配给该应用的 Bandwidth 号码 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 驱动会用你的 client ID 和 secret 换取 access token，并缓存约一小时。如果 token 被提前拒绝，它会被丢弃，下一次发送时重新获取。
- 逐个发送收件人是有意为之：Bandwidth 会把一个请求里的多个号码当作群聊，所有人都能看到彼此的回复。
