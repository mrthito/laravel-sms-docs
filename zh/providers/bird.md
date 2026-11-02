# Bird

<p class="lead">即原来的 MessageBird。本驱动使用 Bird 当前的 SMS API 和工作区（workspace）API key。</p>

| | |
|---|---|
| 驱动键名 | `bird` |
| 覆盖范围 | 全球 |
| 发送方式 | 每个收件人一个请求，[并行发送](/zh/guide/performance)。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [bird.com](https://bird.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| 变量 | |
|---|---|
| `BIRD_API_KEY` | 工作区 API key，以 `bk_` 开头 |
| `BIRD_FROM` | 发件号码或字母数字 ID |
| `BIRD_REGION` | `us1`（默认）或 `eu1`；必须与 key 匹配 |
| `BIRD_CATEGORY` | `transactional`（默认）、`marketing`、`authentication` 或 `service` |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=bird
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- Key 与区域绑定：`bk_eu1_…` 开头的 key 只能配合 `BIRD_REGION=eu1` 使用。
- 请如实设置 `BIRD_CATEGORY`。不少国家对营销类流量有不同的规定，价格也不一样。
- 不支持旧版 MessageBird 的 `AccessKey` 凭据；请在 Bird 控制台中创建工作区 key。
