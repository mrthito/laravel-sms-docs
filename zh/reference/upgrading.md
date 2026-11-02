# 从 1.x 升级

<p class="lead">2.0 版本围绕“发送结果”而不是布尔值重建了核心。大多数应用只需要完成前三步，大约半小时就能搞定。</p>

## 1. 更新扩展包 {#_1-update-the-package}

```bash
composer require mr-rijal/laravel-sms:^2.0
```

如果你在用 **AWS SNS** 驱动，AWS SDK 不再自动安装：

```bash
composer require aws/aws-sdk-php
```

## 2. 重新发布或合并配置 {#_2-re-publish-or-merge-the-config}

```bash
php artisan vendor:publish --tag=sms-config --force
```

如果你自定义过 `config/sms.php`，请手动合并以下变更：

- `default` 的回退值从 `fake` 改为 `log`。
- 新增配置段：`retry`、`http` 和 `providers.failover`。
- 新增服务商：`sinch`、`bird`、`clicksend`、`clickatell`、`brevo`、`bandwidth`、`sendpulse`。
- 移除的服务商：`telegram_mirror`、`discord_webhook`、`slack_webhook`。

## 3. 用发送结果替代布尔值 {#_3-send-results-instead-of-booleans}

`send()`、`sendNow()` 和 `HasSms` 的辅助方法现在返回 `?SmsResult`，而不是 `bool`。

```php
// 1.x
if (Sms::to($n)->message('Hi')->sendNow()) { ... }

// 2.0
$result = Sms::to($n)->message('Hi')->sendNow();
$result?->firstId();
```

当 `SmsSending` 监听器取消了发送，或者 `send()` 把短信放进了队列时，结果为 `null`。发送失败仍然会抛出异常，与 1.x 相同。

## 移除的驱动 {#removed-drivers}

Telegram、Discord 和 Slack 镜像驱动已被移除：它们从来就没有真正发过短信。如果你用它们做内部告警，请改为监听 `SmsSent` 事件，再用 Laravel 通知发到你的频道。

## 异常 {#exceptions}

服务商发送失败会抛出 `MrRijal\LaravelSms\Exceptions\DeliveryException`（仍然是 `RuntimeException`）。无效输入抛出 `InvalidMessageException`，错误配置抛出 `InvalidConfigurationException`（两者仍然是 `InvalidArgumentException`）。捕获 `MrRijal\LaravelSms\Exceptions\SmsException` 即可处理全部异常。

`DeliveryException::$failedRecipients` 和 `DeliveryException::$partial` 会告诉你谁收到了、谁没收到。

## 事件 {#events}

- `SmsSent` 不再有 `success` 和 `error` 属性。它只在发送成功时派发，并带有 `result`（一个 `SmsResult`）。
- 发送失败时会派发新的 `SmsFailed` 事件，并附带 `exception`。
- `SmsSending` 监听器现在可以返回 `false` 来取消发送。

## 通知 {#notifications}

`toSms()` 现在应该**返回**一个 `SmsMessage`（或字符串），而不是自己去发送短信。渠道会通过 `routeNotificationForSms()` 进行路由，并支持 `Notification::route('sms', $number)`。

```php
// 1.x
public function toSms($notifiable): void
{
    Sms::to($notifiable->phone)->message('Shipped')->sendNow();
}

// 2.0
public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create('Shipped');
}
```

`SmsNotification` 不再读取 `sms.queue`。要让通知走队列，和其他 Laravel 通知一样，在通知类上实现 `ShouldQueue`。

## Facade 与管理器 {#facade-and-manager}

- `Sms::to()`、`Sms::provider()`、`Sms::message()` 和 `Sms::template()` 现在每次都返回一个新的 `PendingSms`，两次发送之间不共享任何状态。
- `Sms::sendMessage($message, $provider)` 已被 `Sms::sendNow($message->provider($provider))` 取代。
- `SmsManager` 现在通过容器构造。请从容器中解析它（`app(SmsManager::class)`），不要直接 `new SmsManager`。

## 自定义驱动 {#custom-drivers}

`SmsProvider::send()` 现在必须返回 `SmsResult`：

```php
public function send(SmsMessage $message): SmsResult
{
    // ... 调用服务商 ...

    return SmsResult::accepted($message->getTo(), $providerMessageId);
}
```

继承 `MrRijal\LaravelSms\Drivers\HttpDriver`，就能免费获得配置校验、超时、并发发送、部分失败处理和安全的错误信息。驱动现在使用 Laravel 的 HTTP 客户端，构造函数不再接受 Guzzle `Client`；测试中请使用 `Http::fake()`。

## 测试 {#testing}

把基于 `FakeDriver::$messages` 的断言换成 `Sms::fake()`：

```php
Sms::fake();
// ...
Sms::assertSentTo('+15551234567');
```

`FakeDriver` 仍然保留，供依赖它的应用继续使用。
