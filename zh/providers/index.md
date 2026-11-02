# 如何选择服务商

<p class="lead">所有服务商都通过同一套 API 调用，所以这个选择关乎价格、覆盖范围和资质手续，而不是代码。以后改主意，也只需改 <code>.env</code> 里的一行。</p>

## 一览 {#at-a-glance}

| 服务商 | 键名 | 覆盖范围 | 发送方式 | 模板 | Webhook |
|---|---|---|---|---|---|
| [Twilio](/zh/providers/twilio) | `twilio` | 全球 | 并行 |  |  |
| [Vonage](/zh/providers/vonage) | `vonage` | 全球 | 并行 |  |  |
| [Sinch](/zh/providers/sinch) | `sinch` | 全球 | 批量 |  |  |
| [Bird](/zh/providers/bird) | `bird` | 全球 | 并行 |  |  |
| [Plivo](/zh/providers/plivo) | `plivo` | 全球 | 批量 |  |  |
| [Telnyx](/zh/providers/telnyx) | `telnyx` | 全球 | 并行 |  |  |
| [Infobip](/zh/providers/infobip) | `infobip` | 全球 | 批量 |  |  |
| [ClickSend](/zh/providers/clicksend) | `clicksend` | 全球 | 批量 |  |  |
| [Clickatell](/zh/providers/clickatell) | `clickatell` | 全球 | 批量 |  |  |
| [Brevo](/zh/providers/brevo) | `brevo` | 全球 | 并行 | ✓ |  |
| [Bandwidth](/zh/providers/bandwidth) | `bandwidth` | 美国和加拿大 | 并行 |  |  |
| [SendPulse](/zh/providers/sendpulse) | `sendpulse` | 全球 | 批量 |  |  |
| [Amazon SNS](/zh/providers/aws-sns) | `aws_sns` | 全球 | SDK |  |  |
| [WhatsApp](/zh/providers/whatsapp) | `whatsapp` | 全球 | 并行 | ✓ | ✓ |
| [MSG91](/zh/providers/msg91) | `msg91` | 印度 | 两者皆有 | ✓ |  |
| [Sparrow SMS](/zh/providers/sparrow) | `sparrow` | 尼泊尔 | 批量 |  |  |
| [Termii](/zh/providers/termii) | `termii` | 尼日利亚及非洲 | 并行 |  | ✓ |
| [Sendchamp](/zh/providers/sendchamp) | `sendchamp` | 尼日利亚及非洲 | 批量 |  | ✓ |
| [Africa's Talking](/zh/providers/africastalking) | `africastalking` | 泛非洲 | 批量 |  | ✓ |
| [BulkSMS](/zh/providers/bulksms) | `bulksms` | 全球，南部非洲最强 | 批量 |  | ✓ |

**批量**型服务商在一个请求里接收所有收件人。**并行**型服务商每个请求只接收一个收件人，扩展包会[并发](/zh/guide/performance)发送这些请求。

## 怎么选 {#picking-one}

**先看你的用户在哪里。** 全球性服务商几乎能覆盖所有国家，但在本土，本地网关往往更便宜也更可靠。在尼日利亚，[Termii](/zh/providers/termii) 和 [Sendchamp](/zh/providers/sendchamp) 能绕开免打扰（Do-Not-Disturb）限制，而很多国际发送方会被这一限制拦下。在印度，[MSG91](/zh/providers/msg91) 会帮你处理 DLT 登记。在尼泊尔，[Sparrow SMS](/zh/providers/sparrow) 与两家运营商都直连。

**再看你要发什么。**

- *登录验证码和告警*：快速、可靠的送达比低价更重要。Twilio、Sinch、Vonage 和 Infobip 与运营商的直连最广泛。
- *大规模公告*：适合批量型服务商，一个请求就能发给所有人：Sinch、Plivo、Infobip、ClickSend、Clickatell。
- *需要客户回复的对话*：适合用 [WhatsApp](/zh/providers/whatsapp)，或者提供双向号码和送达 Webhook 的服务商。

**最后看你已经在用什么。** 已经在用 AWS？[Amazon SNS](/zh/providers/aws-sns) 直接记在现有账户上。已经用 Brevo 发邮件？它的[短信服务](/zh/providers/brevo)和邮件共用同一个控制台。

::: tip 别只依赖一家网络
无论选哪家，都用[故障转移](/zh/guide/failover)在它后面再挂一家服务商。宕机很少见，但一旦发生，你的登录验证码照样能送达。
:::

## 发送方 ID 与登记 {#sender-ids-and-registration}

现在大多数国家都要求先完成一定的登记，才能大规模发送应用到个人（A2P）短信：

- **美国：** 10DLC 品牌和营销活动（campaign）登记，或者使用经过验证的免费电话号码（toll-free）。
- **印度：** 在 DLT 平台登记你的发送方 ID 和每一个短信模板。
- **许多其他国家**要求字母数字发送方 ID 预先登记。

服务商会引导你完成这些步骤。上线前请预留几天时间。

## 开发和测试用 {#for-development-and-tests}

| 驱动 | 用途 |
|---|---|
| [`log`](/zh/providers/log) | 本地开发。把每条短信写进 Laravel 日志，而不真正发送。 |
| [`fake`](/zh/guide/testing) | 自动化测试。配合 `Sms::fake()` 做断言。 |
| [`failover`](/zh/guide/failover) | 把多家真实服务商串起来，提高容灾能力。 |
