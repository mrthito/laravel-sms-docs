# Infobip

<p class="lead">企业级平台，运营商覆盖非常广，在欧洲、中东和非洲尤其强。使用 SMS API v3。</p>

| | |
|---|---|
| 驱动键名 | `infobip` |
| 覆盖范围 | 全球 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.infobip.com](https://www.infobip.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| 变量 | |
|---|---|
| `INFOBIP_API_KEY` | API key |
| `INFOBIP_SENDER` | 发件号码或字母数字 ID |
| `INFOBIP_BASE_URL` | Infobip 门户中你的专属基础 URL，例如 `https://xyz123.api.infobip.com` |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 请使用 Infobip 账户首页上显示的**专属基础 URL**。Infobip 通过它路由你的流量，联系技术支持时也会被要求提供。
- 基础 URL 必须使用 HTTPS；否则驱动加载时就会被拒绝。
