# Telnyx

<p class="lead">面向开发者的运营商，运行着自己的私有网络，在美国的价格很有竞争力。</p>

| | |
|---|---|
| 驱动键名 | `telnyx` |
| 覆盖范围 | 全球 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [telnyx.com](https://telnyx.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| 变量 | |
|---|---|
| `TELNYX_API_KEY` | API key（v2） |
| `TELNYX_FROM` | 发件号码 |
| `TELNYX_MESSAGING_PROFILE_ID` | 可选。使用 messaging profile 及其号码池，代替单个发送方 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- `TELNYX_FROM` 和 `TELNYX_MESSAGING_PROFILE_ID` 至少要配置一个。
- 美国号码必须先完成 10DLC 登记，Telnyx 才会投递应用到个人（A2P）的流量。
