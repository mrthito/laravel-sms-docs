# 自定义驱动

<p class="lead">如果你用的服务商没有内置支持，写一个驱动也只是一个小类。基类已经处理好超时、并发、部分失败和安全的错误信息，你只需要描述服务商的 API。</p>

## 一个完整的驱动 {#a-complete-driver}

下面是一个虚构服务商 Acme 的驱动，它每次请求只接受一个收件人：

```php
namespace App\Sms;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use MrRijal\LaravelSms\Drivers\HttpDriver;
use MrRijal\LaravelSms\SentMessage;
use MrRijal\LaravelSms\SmsMessage;
use MrRijal\LaravelSms\SmsResult;

class AcmeDriver extends HttpDriver
{
    protected string $label = 'Acme';

    protected function validateConfig(): void
    {
        $this->require('api_key', 'from');
    }

    public function send(SmsMessage $message): SmsResult
    {
        $text = $this->text($message);

        return $this->sendEach(
            $message,
            fn (PendingRequest $request, string $to) => $request
                ->withToken($this->value('api_key'))
                ->post('https://api.acme.test/v1/messages', [
                    'to' => $to,
                    'from' => $this->sender($message),
                    'text' => $text,
                ]),
            function (Response $response, string $to): SentMessage {
                if (! $response->successful()) {
                    $this->fail($response, 'error.message');
                }

                return new SentMessage($to, $this->jsonString($response, 'id'), 'accepted');
            },
        );
    }
}
```

在 `config/sms.php` 中注册它：

```php
'drivers' => [
    // …
    'acme' => App\Sms\AcmeDriver::class,
],

'providers' => [
    // …
    'acme' => [
        'api_key' => env('ACME_API_KEY'),
        'from' => env('ACME_FROM'),
    ],
],
```

之后它就和内置服务商一样用：`Sms::provider('acme')`、故障转移链、队列发送、`php artisan sms:test --provider=acme`。

## 基类提供的方法 {#what-the-base-class-gives-you}

| 方法 | 用途 |
|---|---|
| `require('key', …)` | 缺少配置时立即报错：“Acme configuration is incomplete” |
| `value('key')` | 以去除首尾空白的字符串读取一项必填配置 |
| `string('key', $default)` / `bool('key')` | 读取可选配置 |
| `oneOf('key', [...], $default)` | 只接受已知的取值，例如区域 |
| `httpsUrl('key', $default)` | 只接受使用 HTTPS 的基础 URL |
| `text($message)` | 获取短信内容；如果是只有模板的短信，则以清晰的错误拒绝 |
| `sender($message)` | 取短信的 `from()`，没有则回退到配置中的发送方 |
| `sendEach(…)` | 每个收件人一个请求，并发执行，并跟踪部分失败 |
| `sendOnce(…)` | 所有收件人合并为一个请求，适用于有批量接口的服务商 |
| `fail($response, 'json.path')` | 抛出带有服务商原因的 `DeliveryException`，原因截断到 200 个字符 |
| `jsonString($response, 'path')` | 从响应体中读取一个字符串（或整数） |
| `cachedToken($clientId, fn () => …)` | 获取 OAuth token 并缓存，直到临近过期 |

基类构建的请求已经带有超时设置、JSON `Accept` 头和 `User-Agent`，而且和其他请求一样会被 `Http::fake()` 捕获。

## 批量接口 {#bulk-endpoints}

如果服务商一次调用就能接受多个收件人，使用 `sendOnce()` 并自己构建结果：

```php
return $this->sendOnce(
    $message,
    fn (PendingRequest $request) => $request
        ->withToken($this->value('api_key'))
        ->post('https://api.acme.test/v1/batches', [
            'to' => $message->getTo(),
            'text' => $this->text($message),
        ]),
    function (Response $response) use ($message): SmsResult {
        if ($response->status() !== 201) {
            $this->fail($response, 'error');
        }

        return SmsResult::accepted($message->getTo(), $this->jsonString($response, 'batch_id'));
    },
);
```

如果服务商会逐个报告每个收件人的状态，就抛出一个带 `failedRecipients` 的 `DeliveryException`，并把已接收的那部分放进 `partial` 结果。[ClickSend 的驱动](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php)是个很好的参照。

## 运行时注册 {#registering-at-runtime}

如果驱动需要从容器中获取依赖，就在服务提供者中注册一个工厂：

```php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

`$config` 是该驱动在 `sms.providers` 中对应的配置项。以这种方式注册的驱动在 Octane、队列 worker 中以及配合 `Sms::fake()` 时都能正常工作。

## 最简实现 {#the-minimum}

任何实现了 `MrRijal\LaravelSms\Contracts\SmsProvider` 的类都是合法的驱动。它只需要一个方法：

```php
public function send(SmsMessage $message): SmsResult;
```

返回已接收的收件人，失败时抛出 `DeliveryException`。继承 `HttpDriver` 不是必须的，但能帮你省掉大量边界情况的处理。

## 接收 Webhook {#receiving-webhooks}

要让你的驱动接收送达报告，实现 `MrRijal\LaravelSms\Contracts\HandlesWebhooks`，并使用 `VerifiesWebhooks` trait 做签名校验。之后发往 `/laravel-sms/webhook/acme` 的请求就会路由到你的 `handleWebhook()` 方法。内置的 [Termii 驱动](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php)展示了这种写法。
