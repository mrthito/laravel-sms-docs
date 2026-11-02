# 性能

<p class="lead">发短信的大部分时间都花在等服务商响应上。扩展包会把这段时间用好：服务商允许时就少发请求，不允许时就并行发送。</p>

## 批量型服务商：一个请求搞定 {#bulk-providers-one-request}

以下服务商一次 API 调用就能接受多个收件人，所以发给 200 人的短信只需一个 HTTP 请求：

**Sinch、Plivo、Infobip、ClickSend、Clickatell、Sparrow SMS、Sendchamp、Africa's Talking、BulkSMS、SendPulse**，以及 **MSG91** 的模板短信。

Clickatell 每次调用最多接受 100 个收件人，超过的部分扩展包会自动分批发送。

## 逐个发送型服务商：并行处理 {#per-recipient-providers-in-parallel}

**Twilio、Vonage、Telnyx、Bird、Brevo、Bandwidth、WhatsApp、Termii** 以及 **MSG91** 的纯文本短信，每个请求只能带一个收件人。扩展包不会等一个请求结束再发下一个，而是用 Laravel 的 `Http::pool()` 并发发送。

默认同时运行 10 个请求：

```ini [.env]
SMS_HTTP_CONCURRENCY=10
```

按每次往返约 300 毫秒计算，100 个收件人大约 3 秒就能发完，而不是 30 秒。批量较大时，如果服务商的频率限制允许，可以把这个数调高；如果遇到 `429 Too Many Requests`，就调低。

Amazon SNS 通过 AWS SDK 发布消息，一次只发一个收件人。

## 超时 {#timeouts}

```ini [.env]
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
```

服务商无法连接时，连接超时会让请求尽快失败。这在[故障转移](/zh/guide/failover)链中尤为重要：10 秒后就轮到下一家服务商，而不是一直卡着。

## Token 缓存 {#token-caching}

Bandwidth 和 SendPulse 使用 OAuth。它们的 access token 会通过 Laravel 的缓存存储缓存起来，直到临近过期，所以大多数发送都能省掉一次额外的往返。如果服务商提前拒绝了某个 token（例如你轮换了凭据之后），这个 token 会被丢弃，下一次发送会重新获取。

## 在你的应用中 {#in-your-application}

- **Web 请求中的发送一律放进队列。** [队列发送](/zh/guide/queueing)能把网络等待完全移出请求过程。
- **大批量发送用批量型服务商。** 一个请求的扩展性远好于几百个请求。
- **一批只发一条短信。** 把一条短信发给 500 个号码，远比把同样的内容单独发送 500 次快得多。
