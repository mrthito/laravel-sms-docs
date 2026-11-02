# 发送结果与错误

<p class="lead">短信只有送到才有意义。每次发送都会告诉你服务商接收了什么；出问题时，也会准确指出受影响的是哪些收件人。</p>

## 发送结果 {#the-result}

`sendNow()` 返回一个 `SmsResult`：

```php
$result = Sms::to(['+15551234567', '+15557654321'])
    ->message('Hi')
    ->sendNow();

$result->provider;      // "twilio"
$result->recipients();  // ["+15551234567", "+15557654321"]
$result->ids();         // ["SM1a…", "SM2b…"]
$result->firstId();     // "SM1a…"
count($result);         // 2

foreach ($result->messages as $sent) {
    $sent->to;      // "+15551234567"
    $sent->id;      // "SM1a…"
    $sent->status;  // "queued"，即服务商报告的状态
}
```

请保存消息 ID。查询服务商的送达报告、处理客服工单（“SM1a… 这条短信去哪了？”），以及把 [Webhook](/zh/guide/webhooks) 和触发它的那条短信对应起来，都要靠它。

::: info 已接收，不等于已送达
拿到结果只说明服务商**接收**了这条短信。送达手机还要再过几秒，如果对方关机或换了号，仍然可能失败。要追踪最终送达状态，请使用 [Webhook](/zh/guide/webhooks)。
:::

`sendNow()` 只在一种情况下返回 `null`：某个 [`SmsSending` 监听器](/zh/guide/events#cancelling-a-send)取消了这次发送。`send()` 在把短信放进队列而没有立即发送时，也会返回 `null`。

## 服务商拒绝时 {#when-a-provider-says-no}

发送被拒或服务商无法连接时，会抛出 `DeliveryException`。它的异常信息是写给人看的，可以放心记录到日志：

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

信息中会附上服务商自己的说明，截断到 200 个字符；你的凭据则永远不会出现在里面。

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400，有 HTTP 状态码时即为该状态码
    $e->failedRecipients;       // 服务商没有接收的号码
    $e->partial?->recipients(); // 失败之前服务商已经接收的号码
}
```

## 部分失败 {#partial-failures}

给一百个人发短信，可能其中一个号码无效。扩展包既不会假装整批都失败了，也不会把失败的那一个藏起来：

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 这 99 人已经收到了，不要再给他们发。
        $delivered = $e->partial->recipients();
    }

    // 只针对这些号码重试、标记或上报。
    $e->failedRecipients;
}
```

异常信息里也会写明失败了多少个：`… (1 of 100 recipients failed)`。

[故障转移](/zh/guide/failover)之所以安全，也是因为这一点：下一家服务商只会收到 `failedRecipients`。

## 扩展包会抛出的所有异常 {#every-exception-the-package-throws}

它们都实现了 `MrRijal\LaravelSms\Exceptions\SmsException`，一个 `catch` 就能兜住整个扩展包：

| 异常 | 父类 | 抛出时机 |
|---|---|---|
| `DeliveryException` | `RuntimeException` | 服务商拒绝了短信、无法连接，或认证失败 |
| `InvalidMessageException` | `InvalidArgumentException` | 号码格式错误、内容为空或过长，或者服务商不支持这类短信 |
| `InvalidConfigurationException` | `InvalidArgumentException` | 服务商名称未知，或其凭据、配置缺失或无效 |

无效的短信和配置会在发送**之前**就报错，你绝不会为一半的错误买单。
