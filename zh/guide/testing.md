# 测试

<p class="lead">测试永远不应该给真实手机发短信。先 fake 掉 Facade，运行你的代码，再对“本该发出”的短信做断言。</p>

## 模拟发送 {#faking-sends}

```php
use MrRijal\LaravelSms\Facades\Sms;
use MrRijal\LaravelSms\SmsMessage;

it('sends a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567'])->assertOk();

    Sms::assertSentTo('+15551234567');
    Sms::assertSent(fn (SmsMessage $sms) => str_contains($sms->getText(), 'code'));
    Sms::assertSentCount(1);
});

it('stays quiet for unverified numbers', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15550000000']);

    Sms::assertNothingSent();
});
```

只要是扩展包发送短信的地方，`Sms::fake()` 都能生效：Facade、通知、`HasSms` trait 以及队列任务。

## 可用的断言 {#available-assertions}

| 断言 | 通过条件 |
|---|---|
| `assertSent($callback)` | 至少有一条已发送的短信符合回调 |
| `assertSent($count)` | 恰好发送了 `$count` 条短信 |
| `assertSentTo($number, $callback = null)` | 有短信发到了 `$number`，号码写成什么格式都行 |
| `assertNotSent($callback = null)` | 没有任何已发送的短信符合条件 |
| `assertNothingSent()` | 一条都没有发送 |
| `assertSentCount($count)` | 恰好发送了 `$count` 条短信 |
| `assertQueued($callback or $count)` | 有短信进入队列，或恰好有 `$count` 条进入队列（每个收件人一条） |
| `assertNothingQueued()` | 没有任何短信进入队列 |

想自己检查短信的话，`Sms::sent()` 和 `Sms::queued()` 会返回 `SmsMessage` 集合。

## 行为与真实发送一致 {#it-behaves-like-the-real-thing}

Fake 不会调用服务商，但在那之前的每一步都会照常执行：

- 短信会被校验，所以无效号码仍然会让测试失败。
- 服务商名称会被检查：`Sms::provider('twillio')` 会抛出异常，和生产环境一样。
- `SmsSending` 和 `SmsSent` 照常触发，你可以测试自己的监听器，包括会取消发送的监听器。
- 通过 `Sms::extend()` 注册的驱动照常可用。
- 每条短信都按发送那一刻的状态记录，即使你的代码之后又修改了它。

## 测试驱动 {#testing-a-driver}

要测试与服务商的集成（包括你自己的[自定义驱动](/zh/guide/custom-drivers)），请改为 fake HTTP 层。所有 HTTP 驱动都使用 Laravel 的 HTTP 客户端，所以 `Http::fake()` 能拦截它们的请求：

```php
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

Http::fake([
    'api.twilio.com/*' => Http::response(['sid' => 'SM123', 'status' => 'queued'], 201),
]);

$result = Sms::provider('twilio')->to('+15551234567')->message('Hi')->sendNow();

expect($result->firstId())->toBe('SM123');

Http::assertSent(fn (Request $request) => $request['To'] === '+15551234567');
```

再加上 `Http::preventStrayRequests()`，确保没有请求漏到真实的 API 上。

::: info Amazon SNS
SNS 驱动使用的是 AWS SDK，而不是 Laravel 的 HTTP 客户端，所以 `Http::fake()` 管不到它。请改为给驱动传入一个 mock 的 `SnsClient`：`new AwsSnsDriver($config, $snsClient)`。
:::
