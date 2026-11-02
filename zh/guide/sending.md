# 编写短信

<p class="lead">每次发送都从 <code>Sms</code> Facade 开始，以四个动作方法之一结束。中间的调用都在描述这条短信。</p>

## 构建器 {#the-builder}

调用 `Sms::to()`、`Sms::provider()`、`Sms::message()` 或 `Sms::template()` 都会返回一个全新的 `PendingSms`。按需链式调用，最后以一个动作方法收尾：

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // 可选：默认取 SMS_PROVIDER
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // 可选：覆盖配置中的发送方
    ->message('Doors open at 7pm.')
    ->send();
```

| 方法 | 作用 | 返回值 |
|---|---|---|
| `send()` | 立即发送；`SMS_QUEUE=true` 时放进队列 | `SmsResult`，放进队列时为 `null` |
| `sendNow()` | 始终立即发送 | `SmsResult`（被监听器取消时为 `null`） |
| `sendLater()` | 始终放进队列 | 无 |
| `sendLaterAt($when)` | 延迟入队（`later()` 是它的别名） | 无 |

由于每次调用 Facade 都会新建一个构建器，两次发送绝不会共用收件人或内容，即使在长时间运行的 Octane worker 里也是如此。

## 收件人 {#recipients}

`to()` 接受单个号码、数组或任意可迭代对象，包括集合：

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

每个号码在添加时都会被清洗和校验：

- 去掉空格、短横线、点和括号。
- 剩下的部分必须是 7 到 15 位数字，可以以 `+` 开头。不符合的会立刻抛出 `InvalidMessageException`，而不是等到服务商那边才失败。
- 重复号码会被去掉，同一次发送里同一个人绝不会收到两条。

::: tip 使用 E.164 格式
存储和发送号码都用国际格式：`+` 加国家代码再加号码。有些服务商会直接拒绝本地格式，还有些会把它路由到错误的国家。
:::

## 短信内容 {#text}

```php
Sms::to($phone)->message('Your table is ready.');
```

内容会去掉首尾空白，且不能为空，最长 1,600 个字符。超过一条短信长度（160 个 GSM 字符；含 emoji 或其他 Unicode 字符时为 70 个）的内容，服务商会拆成多条发送并逐条计费，所以短信越短越省钱。

`content()` 是 `message()` 的别名，如果你更习惯 Laravel 通知里的叫法，可以用它。

## 模板 {#templates}

有些服务商发送的是预先审核过的模板，而不是自由文本。在印度，DLT 法规强制要求使用模板；WhatsApp 由企业主动发起的会话也必须使用模板。

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

支持模板的服务商有 [MSG91](/zh/providers/msg91)、[WhatsApp](/zh/providers/whatsapp) 和 [Brevo](/zh/providers/brevo)。其他服务商只能发文本，给它们发送只有模板的短信会抛出 `InvalidMessageException`，异常信息中会写明是哪家服务商。

## 发送方 {#sender}

每家服务商都配置了一个发送方，可以是号码，也可以是 `ACME` 这样的字母数字 ID。用 `from()` 可以为单条短信覆盖它：

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

字母数字发送方并非处处可用。在美国和加拿大，必须使用已登记的号码发送，所以请针对每个目标国家核对服务商的规定。

## 选择服务商 {#choosing-a-provider}

`provider()` 让这条短信改走指定的服务商，而不是默认那家：

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

有两个名字比较特殊：`failover` 会按顺序依次尝试一串服务商，`random` 会从一个池子里随机挑一家。两者都在[故障转移与负载均衡](/zh/guide/failover)中介绍。

## 按条件组装 {#conditional-parts}

`PendingSms` 支持 Laravel 的 `when()` 和 `unless()`：

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## 提前构建短信 {#building-a-message-ahead-of-time}

`SmsMessage` 是一个普通对象，可以先构建好、到处传递，之后再发送：

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## 宏 {#macros}

给经常发送的短信起个专属的名字：

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Sms::macro('sendOtp', function (string $phone, int $code) {
        return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
    });
}

// 在应用的任意位置
Sms::sendOtp($user->phone, 4821);
```
