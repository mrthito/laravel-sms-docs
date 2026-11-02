# 安装

<p class="lead">一条 Composer 命令，再加几行 <code>.env</code> 配置。服务提供者和 <code>Sms</code> Facade 会自动注册。</p>

## 安装扩展包 {#install-the-package}

```bash
composer require mr-rijal/laravel-sms
```

然后发布配置文件。等你接入第二家服务商或想修改默认值时，就会用到它。

```bash
php artisan vendor:publish --tag=sms-config
```

这会生成 `config/sms.php`。文件里的配置全部读取自环境变量，所以大多数项目根本不需要改这个文件。

## 选择服务商 {#choose-a-provider}

设置默认服务商及其凭据。以 Twilio 为例：

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

每个服务商的页面都列出了它需要的全部变量。还没选好的话，可以先看看[服务商概览](/zh/providers/)。

::: tip 在本地开发？
不要设置 `SMS_PROVIDER`。默认使用 `log` 驱动，它只把每条短信写进 Laravel 日志而不真正发送，不会误发到真实手机上。
:::

## 验证是否可用 {#check-that-it-works}

在终端里发一条真实的短信。它走的代码路径和你的应用完全一样：

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

如果哪里不对，命令会把服务商的返回信息告诉你，例如 `Failed to send SMS via Twilio (HTTP 401): Authenticate`。用 `--provider=sinch` 可以测试指定的服务商，用 `--message="Hello"` 可以自定义短信内容。

`php artisan about` 也会多出一个 **Laravel SMS** 区块，显示默认服务商，以及队列和 Webhook 是否已开启。

## 可选：Amazon SNS {#optional-amazon-sns}

AWS SDK 体积很大，所以默认不安装。如果要用 [Amazon SNS](/zh/providers/aws-sns) 驱动：

```bash
composer require aws/aws-sdk-php
```

## 下一步 {#next-steps}

[发送第一条短信 →](/zh/guide/quick-start)
