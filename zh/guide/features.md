# 功能一览

<p class="lead">扩展包的全部功能，汇总在这一页。每一项都链接到指南中对应的详细说明。</p>

## 发送 {#sending}

| | |
|---|---|
| **一套 API，二十家服务商** | Twilio、Vonage、Sinch、Bird、Plivo、Telnyx、Infobip、ClickSend、Clickatell、Brevo、Bandwidth、SendPulse、Amazon SNS、WhatsApp、MSG91、Sparrow SMS、Termii、Sendchamp、Africa's Talking 和 BulkSMS。[服务商 →](/zh/providers/) |
| **流畅的构建器** | `Sms::to()->message()->send()`，每次调用都是一条全新的短信。[编写短信 →](/zh/guide/sending) |
| **号码清洗** | 去掉空格、短横线、点和括号，去除重复号码，无效号码在发送前就被拒绝。[收件人 →](/zh/guide/sending#recipients) |
| **覆盖发送方** | 逐条短信设置 `->from('ACME')`。[发送方 →](/zh/guide/sending#sender) |
| **模板** | MSG91 Flow（DLT）、WhatsApp 模板和 Brevo 模板，其他服务商可回退到文本。[短信模板 →](/zh/guide/templates) |
| **宏** | 给常发的短信起个名字：`Sms::sendOtp($phone, $code)`。[宏 →](/zh/guide/sending#macros) |

## 可靠性 {#reliability}

| | |
|---|---|
| **带消息 ID 的发送结果** | 每次发送都会返回服务商为每个已接收收件人分配的 ID。[发送结果 →](/zh/guide/results) |
| **精确的失败信息** | `DeliveryException` 会列出失败的收件人和已发出的收件人。[部分失败 →](/zh/guide/results#partial-failures) |
| **故障转移** | 把服务商串起来；只有被拒的收件人会转交下一家，没人会收到两遍。[故障转移 →](/zh/guide/failover) |
| **负载均衡** | 把短信分摊到一组服务商上。[负载均衡 →](/zh/guide/failover#load-balancing) |
| **队列发送** | `sendLater()`、`sendLaterAt()`，每个收件人一个加密任务，并支持重试。[队列发送 →](/zh/guide/queueing) |

## 速度 {#speed}

| | |
|---|---|
| **批量请求** | 有批量接口的服务商，一次调用就收下所有收件人。[性能 →](/zh/guide/performance) |
| **并行请求** | 其余服务商并发发送，默认每次 10 个。[性能 →](/zh/guide/performance#per-recipient-providers-in-parallel) |
| **Token 缓存** | OAuth token 在过期前重复使用。[Token 缓存 →](/zh/guide/performance#token-caching) |

## Laravel 集成 {#laravel-integration}

| | |
|---|---|
| **通知渠道** | `via()` 返回 `'sms'`，`toSms()` 返回短信。[通知 →](/zh/guide/notifications) |
| **事件** | `SmsSending`（可取消）、`SmsSent`、`SmsFailed` 和 `SmsWebhookReceived`。Laravel 会自动找到你的监听器类。[事件 →](/zh/guide/events) |
| **Webhook** | WhatsApp、Termii、Sendchamp、Africa's Talking 和 BulkSMS 的签名送达报告。[Webhook 回调 →](/zh/guide/webhooks) |
| **Artisan** | `php artisan sms:test`，以及 `php artisan about` 中的专属区块。[Artisan 命令 →](/zh/reference/artisan) |
| **兼容 Octane 和队列** | 发送之间、请求之间不共享任何状态。 |

## 测试 {#testing}

| | |
|---|---|
| **`Sms::fake()`** | 只记录不发送，断言写起来清晰易读。[测试 →](/zh/guide/testing) |
| **`Http::fake()`** | 所有 HTTP 驱动都基于 Laravel 的 HTTP 客户端。[测试驱动 →](/zh/guide/testing#testing-a-driver) |

## 安全 {#security}

| | |
|---|---|
| **默认拒绝的 Webhook** | 未签名或无法验证的请求一律拒绝。[Webhook 回调 →](/zh/guide/webhooks) |
| **加密的队列载荷** | 验证码和号码都用你的 `APP_KEY` 加密。[队列发送 →](/zh/guide/queueing#encrypted-at-rest) |
| **凭据卫生** | 异常信息、URL 和缓存键中不含任何密钥；日志中的号码会打码。[安全 →](/zh/guide/security) |

## 扩展 {#extending}

| | |
|---|---|
| **自定义驱动** | 继承 `HttpDriver`，只需描述服务商的 API。[自定义驱动 →](/zh/guide/custom-drivers) |
| **运行时注册** | 在服务提供者中调用 `Sms::extend('acme', …)`。[运行时注册 →](/zh/guide/custom-drivers#registering-at-runtime) |
