# Sinch

<p class="lead">运营商级平台，在许多国家与运营商直连。所有收件人通过一个批量请求发出。</p>

| | |
|---|---|
| 驱动键名 | `sinch` |
| 覆盖范围 | 全球 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [sinch.com](https://sinch.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| 变量 | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | SMS 控制台中的 Service plan ID |
| `SINCH_API_TOKEN` | 该 service plan 的 API token |
| `SINCH_FROM` | 发件号码或字母数字 ID |
| `SINCH_REGION` | `us`（默认）、`eu`、`au`、`br` 或 `ca`；必须与账号所在区域一致 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 请使用创建 service plan 时所在的区域。区域不匹配时，即使 token 有效也会返回 `401`。
- 整批短信共用一个 Sinch batch ID，可以通过 `$result->firstId()` 获取。
