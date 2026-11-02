# Artisan 命令

## sms:test {#sms-test}

发送一条真实短信来验证凭据，走的代码路径与你的应用完全相同。

```bash
php artisan sms:test {to} [--provider=] [--message=]
```

| | |
|---|---|
| `to` | 收件人，最好使用 E.164 格式：`+15551234567` |
| `--provider` | 要使用的服务商键名，默认取 `SMS_PROVIDER`。 |
| `--message` | 要发送的内容，默认是一条简短的测试短信。 |

```bash
php artisan sms:test +15551234567 --provider=sinch --message="Hello from production"
```

成功时会输出服务商和消息 ID。失败时会输出服务商给出的原因，并以非零状态码退出，所以可以用在部署脚本和健康检查中。

::: warning 它会发送真实短信
服务商也会照常计费。请用你自己的号码测试。
:::

## about {#about}

Laravel 的 `php artisan about` 命令会包含一个 **Laravel SMS** 区块：

```text
  Laravel SMS ............................................................
  Default provider ................................................. twilio
  Queue .......................................................... disabled
  Webhooks ........................................................ enabled
```
