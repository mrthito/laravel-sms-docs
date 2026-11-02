# Plivo

<p class="lead">性价比高的全球服务商，REST API 简洁。所有收件人通过一个请求发出。</p>

| | |
|---|---|
| 驱动键名 | `plivo` |
| 覆盖范围 | 全球 |
| 发送方式 | 所有收件人合并为一个请求。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [www.plivo.com](https://www.plivo.com) |

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| 变量 | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth token |
| `PLIVO_FROM` | 发件号码或字母数字 ID |
| `PLIVO_LOG_MESSAGES` | 可选，默认 `false`。是否允许 Plivo 在其日志中保存短信内容和号码 |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 本驱动默认**关闭** Plivo 自身的内容日志，所以短信内容不会保留在 Plivo 控制台中。只在需要调试时再打开。
- 每个收件人都会获得一个独立的 Plivo 消息 UUID，顺序与你传入的收件人一致。
