# 发送第一条短信

<p class="lead">带你快速走一遍最常做的五件事：发送、查看结果、放进队列、发通知、写测试。</p>

## 发送短信 {#send-a-message}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

号码里可以带空格、短横线、点和括号：`+1 (555) 123-4567` 和 `+15551234567` 是同一个收件人。尽量使用以 `+` 开头的国际格式，大多数服务商要靠它来路由短信。

## 查看发送结果 {#check-what-happened}

`sendNow()` 会立即发送，并返回一个 `SmsResult`：

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // 服务商返回的消息 ID，建议保存下来
```

如果服务商拒绝了这条短信，`DeliveryException` 会告诉你原因：

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

部分失败的处理方式以及每个属性的含义，见[发送结果与错误](/zh/guide/results)。

## 放进队列 {#queue-it}

发送要走一次网络往返。在 Web 请求里，把短信放进队列，用户就不用干等：

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## 以通知的形式发送 {#send-it-as-a-notification}

如果你已经在用 Laravel 通知，加上 `sms` 渠道即可：

```php
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.");
    }
}
```

渠道会通过 `routeNotificationForSms()` 向你的模型要手机号。详见[通知](/zh/guide/notifications)。

## 编写测试 {#test-it}

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

以上就是这个包的核心用法。指南的其余部分会逐一深入，先从[编写短信](/zh/guide/sending)开始。
