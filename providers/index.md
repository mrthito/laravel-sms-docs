# Choosing a provider

<p class="lead">Every provider works through the same API, so this choice is about price, reach and paperwork rather than code. Switching later means adding the new provider's credentials and changing <code>SMS_PROVIDER</code>; your code stays the same.</p>

## At a glance

| Provider | Key | Coverage | Sending | Templates | Webhooks |
|---|---|---|---|---|---|
| [Twilio](/providers/twilio) | `twilio` | Global | Parallel |  |  |
| [Vonage](/providers/vonage) | `vonage` | Global | Parallel |  |  |
| [Sinch](/providers/sinch) | `sinch` | Global | Bulk |  |  |
| [Bird](/providers/bird) | `bird` | Global | Parallel |  |  |
| [Plivo](/providers/plivo) | `plivo` | Global | Bulk |  |  |
| [Telnyx](/providers/telnyx) | `telnyx` | Global | Parallel |  |  |
| [Infobip](/providers/infobip) | `infobip` | Global | Bulk |  |  |
| [ClickSend](/providers/clicksend) | `clicksend` | Global | Bulk |  |  |
| [Clickatell](/providers/clickatell) | `clickatell` | Global | Bulk |  |  |
| [Brevo](/providers/brevo) | `brevo` | Global | Parallel | ✓ |  |
| [Bandwidth](/providers/bandwidth) | `bandwidth` | United States and Canada | Parallel |  |  |
| [SendPulse](/providers/sendpulse) | `sendpulse` | Global | Bulk |  |  |
| [Amazon SNS](/providers/aws-sns) | `aws_sns` | Global | SDK |  |  |
| [WhatsApp](/providers/whatsapp) | `whatsapp` | Global | Parallel | ✓ | ✓ |
| [MSG91](/providers/msg91) | `msg91` | India | Both | ✓ |  |
| [Sparrow SMS](/providers/sparrow) | `sparrow` | Nepal | Bulk |  |  |
| [Termii](/providers/termii) | `termii` | Nigeria and Africa | Parallel |  | ✓ |
| [Sendchamp](/providers/sendchamp) | `sendchamp` | Nigeria and Africa | Bulk |  | ✓ |
| [Africa's Talking](/providers/africastalking) | `africastalking` | Pan-Africa | Bulk |  | ✓ |
| [BulkSMS](/providers/bulksms) | `bulksms` | Global, strongest in Southern Africa | Bulk |  | ✓ |

**Bulk** providers take every recipient in one request. **Parallel** providers take one recipient per request, which the package sends [concurrently](/guide/performance).

## Picking one

**Start with where your users are.** Global providers reach almost every country, but local gateways are often cheaper and more reliable at home. In Nigeria, [Termii](/providers/termii) and [Sendchamp](/providers/sendchamp) route around Do-Not-Disturb restrictions that block many international senders. In India, [MSG91](/providers/msg91) handles DLT registration. In Nepal, [Sparrow SMS](/providers/sparrow) connects directly to both operators.

**Then consider what you're sending.**

- *Login codes and alerts* need fast, reliable delivery more than low prices. Twilio, Sinch, Vonage and Infobip have the deepest direct operator connections.
- *Large announcements* favor bulk providers, which send to everyone in one request: Sinch, Plivo, Infobip, ClickSend, Clickatell.
- *Conversations* where customers reply belong on [WhatsApp](/providers/whatsapp) or a provider with two-way numbers and delivery webhooks.

**And what you already have.** Already on AWS? [Amazon SNS](/providers/aws-sns) bills to your existing account. Sending email through Brevo? Its [SMS](/providers/brevo) shares the same dashboard.

::: tip Don't depend on one network
Whichever you choose, add a second provider behind it with [failover](/guide/failover). Outages are rare, but when they happen, your login codes keep arriving.
:::

## Sender IDs and registration

Most countries now require some registration before you can send application-to-person SMS at scale:

- **United States:** 10DLC brand and campaign registration, or a verified toll-free number.
- **India:** DLT registration of your sender ID and every message template.
- **Many others** require alphanumeric sender IDs to be pre-registered.

Your provider guides you through this. Allow a few days before launch.

## For development and tests

| Driver | Use it for |
|---|---|
| [`log`](/providers/log) | Local development. Writes each message to your Laravel log instead of sending it. |
| [`fake`](/guide/testing) | Automated tests. Use `Sms::fake()` for assertions. |
| [`failover`](/guide/failover) | Chaining real providers for resilience. |
