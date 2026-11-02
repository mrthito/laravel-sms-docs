# Log

<p class="lead">The default driver. It writes every message to your Laravel log instead of sending it, so you can build and click through SMS features without a provider account or a real phone.</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # optional: a dedicated channel from config/logging.php
```

Each message becomes one `debug` entry:

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

Recipients are masked, but the message text is logged in full so you can read your codes while developing. That's also why the log driver must **never be used in production**: login codes would end up in your log files.

`sendNow()` returns an `SmsResult` with a generated `log-…` message ID, so code that stores IDs works unchanged.
