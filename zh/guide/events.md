# 事件

<p class="lead">四个事件覆盖了一条短信的完整生命周期。可以用它们做审计日志、数据统计、退订名单，或者在最后一刻拦下一条短信。</p>

| 事件 | 触发时机 | 属性 |
|---|---|---|
| `SmsSending` | 调用服务商之前 | `message`、`provider` |
| `SmsSent` | 服务商接收短信之后 | `message`、`provider`、`result` |
| `SmsFailed` | 发送失败之后（异常照常抛出） | `message`、`provider`、`exception` |
| `SmsWebhookReceived` | 收到一条通过验证的服务商 Webhook 之后 | `provider`、`payload`、`messageId`、`status`、`recipient` |

这四个事件都位于 `MrRijal\LaravelSms\Events` 命名空间下。`provider` 是这条短信实际使用的名称：用 `random` 时，是它挑中的那家服务商，比如 `twilio`；用 `failover` 时，就是 `failover`。

## 编写监听器 {#writing-a-listener}

从 Laravel 11 开始，监听器会自动注册。生成一个监听器，在 `handle()` 中对事件做类型提示，Laravel 就会帮你接好：不需要服务提供者，也不需要 `$listen` 数组。

```bash
php artisan make:listener RecordSentSms --event="MrRijal\LaravelSms\Events\SmsSent"
```

```php
namespace App\Listeners;

use App\Models\SmsLog;
use MrRijal\LaravelSms\Events\SmsSent;

class RecordSentSms
{
    public function handle(SmsSent $event): void
    {
        foreach ($event->result->messages as $sent) {
            SmsLog::create([
                'provider' => $event->provider,
                'to' => $sent->to,
                'provider_id' => $sent->id,
                'status' => $sent->status,
            ]);
        }
    }
}
```

Laravel 会扫描 `app/Listeners`，找到 `handle(SmsSent $event)`，并把这个监听器注册到该事件上。可以用下面的命令查看它发现了哪些监听器：

```bash
php artisan event:list --event=SmsSent
```

在生产环境中，`php artisan optimize` 会把发现的监听器连同配置和路由一起缓存起来。

::: tip 监听器不会导致重复发送
`SmsSent` 触发时，服务商已经拿到了这条短信。即使某个监听器抛出异常，异常也只会交给你的错误处理器，这次发送仍算成功。这样，队列任务就不会因为一次审计日志写入失败而把同样的内容再发一遍。
:::

### 一个监听器处理多个事件 {#one-listener-several-events}

联合类型同样可用。下面这个监听器同时处理成功和失败两种结果：

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### 队列监听器 {#queued-listeners}

写数据库或调用统计 API，不应该拖慢发送。实现 `ShouldQueue`，监听器就会在队列中运行：

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class RecordSentSms implements ShouldQueue
{
    public function handle(SmsSent $event): void
    {
        // …
    }
}
```

在 Laravel 13 中，可以用注解（attribute）指定队列：

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## 取消发送 {#cancelling-a-send}

在 `SmsSending` 监听器中返回 `false`，这条短信就不会发出，`sendNow()` 随后返回 `null`。

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // 回复过 STOP（退订）的人，不再给他们发短信。
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

返回 `null`（或者什么都不返回）就会放行。只有明确返回 `false` 才会取消。

::: warning 这个监听器必须同步执行
用于取消发送的监听器不能实现 `ShouldQueue`。队列监听器要等短信发出之后才会运行，那时已经没有什么可以取消的了。
:::

监听器能看到完整的短信：`getTo()`、`getText()`、`getTemplateId()`、`getVariables()`、`getFrom()` 和 `getProvider()`。

## 处理发送失败 {#reacting-to-failures}

```php
namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use MrRijal\LaravelSms\Events\SmsFailed;

class AlertOnSmsFailure
{
    public function handle(SmsFailed $event): void
    {
        Log::warning('SMS failed', [
            'provider' => $event->provider,
            'recipients' => $event->message->getRedactedRecipientsForLogging(),
            'error' => $event->exception->getMessage(),
        ]);
    }
}
```

`getRedactedRecipientsForLogging()` 只保留号码的最后四位，其余全部打码（`***4567`），日志里就不会堆满手机号。

每次发送失败，扩展包本身已经会写一行 `error` 级别的日志。发送成功则不记日志；需要的话，请添加一个 `SmsSent` 监听器。

## 闭包监听器 {#closure-listeners}

临时用一下的话，在 `AppServiceProvider::boot()` 中写个闭包也行：

```php
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

public function boot(): void
{
    Event::listen(function (SmsSent $event) {
        // …
    });
}
```

监听器类更容易测试，也更容易放进队列，所以需要长期保留的逻辑，还是优先写成类。

## 测试监听器 {#testing-your-listeners}

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

`Sms::fake()` 会像真实发送一样触发 `SmsSending` 和 `SmsSent`，所以你也可以对监听器做端到端测试。详见[测试](/zh/guide/testing)。
