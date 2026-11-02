# API

<p class="lead">日常会用到的公开类和方法，都汇总在这一页。</p>

## Sms Facade {#sms-facade}

`MrRijal\LaravelSms\Facades\Sms` 代理到 `SmsManager`。

| 方法 | 返回值 | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | 开始一条发给这些号码的短信 |
| `provider(string $name)` | `PendingSms` | 开始一条走指定服务商的短信 |
| `message(string $text)` | `PendingSms` | 开始一条带有该内容的短信 |
| `template(string $id, array $vars = [])` | `PendingSms` | 开始一条模板短信 |
| `compose(?SmsMessage $message = null)` | `PendingSms` | 把已有的短信包装进构建器 |
| `send(SmsMessage $message)` | `?SmsResult` | 发送；开启 `sms.queue` 时放进队列 |
| `sendNow(SmsMessage $message)` | `?SmsResult` | 立即发送 |
| `queue(SmsMessage $message, $delay = null)` | `void` | 每个收件人一个队列任务 |
| `driver(?string $name = null)` | `SmsProvider` | 某个服务商的驱动实例 |
| `extend(string $name, Closure $factory)` | `SmsManager` | 注册自定义驱动 |
| `getDefaultDriver()` | `string` | 默认服务商的键名 |
| `forgetDrivers()` | `SmsManager` | 清除已缓存的驱动实例 |
| `macro(string $name, callable $macro)` | `void` | 添加自定义方法 |
| `fake()` | `SmsFake` | 用只记录、不发送的 fake 替换管理器 |

## PendingSms {#pendingsms}

由 Facade 返回；除了四个动作方法，其余方法都返回构建器本身。

| 方法 | |
|---|---|
| `to(string\|iterable $numbers)` | 添加收件人 |
| `message(string $text)` / `content(string $text)` | 设置短信内容 |
| `template(string $id, array $vars = [])` | 使用服务商模板 |
| `from(?string $sender)` | 覆盖发送方 |
| `provider(string $name)` | 选择服务商 |
| `when($condition, $callback)` / `unless(…)` | 按条件应用修改 |
| `getMessage()` | 底层的 `SmsMessage` |
| `send()` → `?SmsResult` | 发送；开启 `sms.queue` 时放进队列 |
| `sendNow()` → `?SmsResult` | 立即发送 |
| `sendLater()` | 放进队列 |
| `sendLaterAt($when)` / `later($when)` | 延迟入队：日期、时间间隔或秒数 |

## SmsMessage {#smsmessage}

`MrRijal\LaravelSms\SmsMessage` 表示一条短信。setter 方法返回短信本身，可以链式调用。

| 方法 | |
|---|---|
| `SmsMessage::create(?string $text = null)` | 新建一条短信，可选择同时传入内容 |
| `to()`、`message()`、`content()`、`template()`、`from()`、`provider()` | 与 `PendingSms` 上的相同 |
| `getTo()` → `list<string>` | 规范化后的收件人 |
| `getText()`、`getTemplateId()`、`getFrom()`、`getProvider()` → `?string` | |
| `getVariables()` → `array` | 模板变量 |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | 复制一份，改发给其他号码 |
| `getRedactedRecipientsForLogging()` → `list<string>` | 打码为 `***4567` 形式的号码 |
| `validate()` | 无法发送时抛出 `InvalidMessageException` |

## SmsResult {#smsresult}

| 成员 | |
|---|---|
| `$provider` | 短信实际经过的服务商键名 |
| `$messages` | `list<SentMessage>`，每个已接收的收件人一项 |
| `recipients()` → `list<string>` | 已接收的号码 |
| `ids()` → `list<string>` | 去重后的服务商消息 ID |
| `firstId()` → `?string` | 第一个消息 ID |
| `count()` | 已接收的收件人数量 |

`SentMessage` 有三个只读属性：`$to`、`$id` 和 `$status`。

## 异常 {#exceptions}

都位于 `MrRijal\LaravelSms\Exceptions` 下，并且都实现了 `SmsException`。

| 类 | 成员 / 场景 |
|---|---|
| `DeliveryException` | `$provider`、`$failedRecipients`、`$partial`（`?SmsResult`）、`hasPartialDelivery()`、`getCode()`（HTTP 状态码） |
| `InvalidMessageException` | 号码格式错误、内容为空或过长、不支持的短信类型 |
| `InvalidConfigurationException` | 未知的服务商、配置缺失或无效 |

## 契约 {#contracts}

| 接口 | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult`：实现它即可编写驱动 |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response`：接收服务商 Webhook |
| `Contracts\Factory` | 绑定到管理器；依赖注入时用它做类型提示 |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
