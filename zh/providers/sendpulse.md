# SendPulse

<p class="lead">多渠道营销平台，在欧洲和拉丁美洲很受欢迎。通过 OAuth 2.0 认证，所有收件人通过一个请求发出。</p>

| | |
|---|---|
| 驱动键名 | `sendpulse` |
| 覆盖范围 | 全球 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [sendpulse.com](https://sendpulse.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| 变量 | |
|---|---|
| `SENDPULSE_CLIENT_ID` | REST API ID |
| `SENDPULSE_CLIENT_SECRET` | REST API secret |
| `SENDPULSE_SENDER` | 已获批的发送方名称（最多 11 个字符） |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- Access token 会缓存约一小时，到期自动刷新。
- 发送方名称需要先在 SendPulse 控制台中审核通过才能使用。
