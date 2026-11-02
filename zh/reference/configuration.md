# 配置

<p class="lead"><code>config/sms.php</code> 中的所有配置项，以及对应的环境变量。用 <code>php artisan vendor:publish --tag=sms-config</code> 发布这个文件；你很少需要修改它。</p>

## 发送 {#sending}

| 配置项 | 环境变量 | 默认值 | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | 短信没有指定服务商时使用的服务商。也可以设为 `failover` 和 `random`。 |
| `random_drivers` | — | `['twilio', 'msg91']` | `random` 从中挑选的服务商池。 |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | `failover` 的服务商链，以逗号分隔，按顺序尝试。 |

## 队列 {#queueing}

| 配置项 | 环境变量 | 默认值 | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | 为 `true` 时，`send()` 放进队列而不是立即发送。 |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | 你的默认连接 | 短信任务使用的队列连接。 |
| `queue_name` | `SMS_QUEUE_NAME` | 你的默认队列 | 短信任务使用的队列名称。 |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | 每个收件人的任务判定失败前的尝试次数。 |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | 任务最长可运行的秒数。队列的 `retry_after` 要大于这个值。 |
| `retry.backoff` | — | `[10, 30, 60]` | 每次重试前等待的秒数。 |

## HTTP {#http}

| 配置项 | 环境变量 | 默认值 | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | 等待服务商响应的秒数。 |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | 等待建立连接的秒数。 |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | 逐个发送型服务商的并行请求数。 |

## Webhook {#webhooks}

| 配置项 | 环境变量 | 默认值 | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | 注册 Webhook 路由。 |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | URL 前缀，后面会拼上服务商键名。 |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | 应用到该路由的中间件。 |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | Meta 应用密钥。 |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | 用于 Meta 订阅校验的 token。 |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | 以 `?token=` 的形式放在回调 URL 中。 |

## 驱动与服务商 {#drivers-and-providers}

两个映射把服务商键名分别与它的代码和凭据关联起来：

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

`drivers` 决定由哪个类处理某个键名，`providers` 保存该键名的配置，这些配置会传给对应的类。每个[服务商页面](/zh/providers/)都列出了它的配置项。

如果要让同一家服务商使用两个账号（比如一个发事务短信、一个发营销短信），就用不同的键名把同一个类注册两次：

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## 配置缓存 {#config-caching}

配置中没有闭包，所以 `php artisan config:cache` 可以照常使用。在生产环境修改 `.env` 后，记得重新运行一次。
