# Log 驱动

<p class="lead">默认驱动。它把每条短信写进 Laravel 日志而不真正发送，让你不用注册服务商账号、不用真手机，就能开发和点测短信功能。</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # 可选：config/logging.php 中一个专用的日志通道
```

每条短信对应一条 `debug` 日志：

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

收件人号码会打码，但短信内容会完整记录，方便你在开发时看到验证码。也正因如此，Log 驱动**绝不能用于生产环境**：否则登录验证码会留在你的日志文件里。

`sendNow()` 会返回一个带有生成的 `log-…` 消息 ID 的 `SmsResult`，所以保存消息 ID 的代码无需任何改动。
