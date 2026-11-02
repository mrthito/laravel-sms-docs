# 短信模板

<p class="lead">有些短信不能随便写。在印度，每条商业短信都必须匹配一个已登记的模板；在 WhatsApp 上，企业只能用审核通过的模板主动发起会话。本页介绍如何配置和发送模板。</p>

## 什么时候需要模板 {#when-you-need-a-template}

| 场景 | 原因 |
|---|---|
| 发送到印度号码 | DLT 法规要求每条商业短信都匹配一个在运营商处登记过的模板 |
| 主动发起 WhatsApp 会话 | 在客户最后一条消息之后的 24 小时以外，WhatsApp 只投递审核通过的模板 |
| 不想把文案写死在代码里 | 市场或客服团队可以直接在服务商控制台修改措辞，无需重新部署 |

支持模板的服务商有 **[MSG91](/zh/providers/msg91)**、**[WhatsApp](/zh/providers/whatsapp)** 和 **[Brevo](/zh/providers/brevo)**。其他服务商都只发送文本。

## 发送模板 {#sending-a-template}

传入模板 ID 和变量：

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

不同服务商对 ID 和变量的理解略有不同。

## 各服务商如何解读 {#how-each-provider-reads-them}

### MSG91 {#msg91}

ID 是 MSG91 控制台中的 **Flow ID**。变量名必须与 Flow 中的变量一致，所有收件人收到的值都相同。

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

所有收件人在一个请求中发出。你的发送方 ID（`MSG91_SENDER`）必须和模板一起在 DLT 上登记。

### WhatsApp {#whatsapp}

ID 是**模板名称**，与 WhatsApp Manager 中显示的完全一致。变量**按顺序**填入模板正文的占位符：第一个值替换 <code v-pre>{{1}}</code>，第二个替换 <code v-pre>{{2}}</code>，依此类推。数组的键名只是为了方便你自己阅读。

```php
// 模板 "order_update"："Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

每条消息都使用 `WHATSAPP_TEMPLATE_LANGUAGE` 中设置的语言（默认 `en`）。它必须是模板已获批的语言之一，例如 `en_US` 或 `pt_BR`。

::: info 仅限正文
驱动只填充正文占位符。带有头部媒体、URL 按钮或其他组件的模板，需要直接调用 WhatsApp API，或者编写[自定义驱动](/zh/guide/custom-drivers)。
:::

### Brevo {#brevo}

ID 是 Brevo 中的**短信模板 ID**，变量会成为模板的 `params`：

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## 带文本回退的模板 {#templates-with-a-text-fallback}

一条短信可以同时带上模板**和**纯文本。支持模板的服务商发送模板，其他服务商发送文本。这样模板就能放心地和[故障转移](/zh/guide/failover)搭配使用：

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

MSG91 发送 DLT 模板；如果 MSG91 不可用，就由 Twilio 改发文本。

把只有模板的短信发给只支持文本的服务商，会在发送任何内容之前抛出 `InvalidMessageException`，异常信息中会写明是哪家服务商。在故障转移链中，这家服务商会被直接跳过。

## 别把模板 ID 写死在代码里 {#keeping-template-ids-out-of-your-code}

模板 ID 是一串难以辨认的字符，很容易写错。用一个 backed enum，就能给每个模板一个名字，享受自动补全，修改时也只需改一处：

```php
namespace App\Enums;

enum SmsTemplate: string
{
    case LoginCode = '6512a8d3f1c2b';
    case OrderShipped = '6512a9e07a4d1';
}
```

```php
use App\Enums\SmsTemplate;

Sms::to($user->phone)
    ->template(SmsTemplate::LoginCode->value, ['otp' => $code])
    ->send();
```

如果不同环境的 ID 不一样，就把它们放在 `config/services.php` 中，改用 `config('services.msg91.templates.login_code')` 读取。

## 在通知中使用模板 {#templates-in-notifications}

`toSms()` 可以像返回普通短信一样返回模板短信：

```php
use App\Enums\SmsTemplate;
use MrRijal\LaravelSms\SmsMessage;

public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create()
        ->template(SmsTemplate::OrderShipped->value, ['order' => $this->order->number])
        ->provider('msg91');
}
```

或者使用现成的通知类：

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## 测试模板短信 {#testing-template-messages}

`Sms::fake()` 会记录模板 ID 和变量，你可以对它们做断言：

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
