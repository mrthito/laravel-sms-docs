# プロバイダーの選び方

<p class="lead">どのプロバイダーも同じ API で動くので、選ぶ基準はコードではなく、料金、カバー範囲、そして登録などの手続きです。後から乗り換える場合も、新しいプロバイダーの認証情報を追加して <code>SMS_PROVIDER</code> を変えるだけで、コードはそのままです。</p>

## 一覧 {#at-a-glance}

| プロバイダー | キー | 対応地域 | 送信方式 | テンプレート | Webhook |
|---|---|---|---|---|---|
| [Twilio](/ja/providers/twilio) | `twilio` | グローバル | 並列 |  |  |
| [Vonage](/ja/providers/vonage) | `vonage` | グローバル | 並列 |  |  |
| [Sinch](/ja/providers/sinch) | `sinch` | グローバル | 一括 |  |  |
| [Bird](/ja/providers/bird) | `bird` | グローバル | 並列 |  |  |
| [Plivo](/ja/providers/plivo) | `plivo` | グローバル | 一括 |  |  |
| [Telnyx](/ja/providers/telnyx) | `telnyx` | グローバル | 並列 |  |  |
| [Infobip](/ja/providers/infobip) | `infobip` | グローバル | 一括 |  |  |
| [ClickSend](/ja/providers/clicksend) | `clicksend` | グローバル | 一括 |  |  |
| [Clickatell](/ja/providers/clickatell) | `clickatell` | グローバル | 一括 |  |  |
| [Brevo](/ja/providers/brevo) | `brevo` | グローバル | 並列 | ✓ |  |
| [Bandwidth](/ja/providers/bandwidth) | `bandwidth` | 米国・カナダ | 並列 |  |  |
| [SendPulse](/ja/providers/sendpulse) | `sendpulse` | グローバル | 一括 |  |  |
| [Amazon SNS](/ja/providers/aws-sns) | `aws_sns` | グローバル | SDK |  |  |
| [WhatsApp](/ja/providers/whatsapp) | `whatsapp` | グローバル | 並列 | ✓ | ✓ |
| [MSG91](/ja/providers/msg91) | `msg91` | インド | 両方 | ✓ |  |
| [Sparrow SMS](/ja/providers/sparrow) | `sparrow` | ネパール | 一括 |  |  |
| [Termii](/ja/providers/termii) | `termii` | ナイジェリア・アフリカ | 並列 |  | ✓ |
| [Sendchamp](/ja/providers/sendchamp) | `sendchamp` | ナイジェリア・アフリカ | 一括 |  | ✓ |
| [Africa's Talking](/ja/providers/africastalking) | `africastalking` | アフリカ全域 | 一括 |  | ✓ |
| [BulkSMS](/ja/providers/bulksms) | `bulksms` | グローバル（南部アフリカに強い） | 一括 |  | ✓ |

**一括**のプロバイダーは、すべての宛先を 1 回のリクエストで受け付けます。**並列**のプロバイダーは 1 リクエストにつき宛先 1 件で、パッケージがそれらを[並列に](/ja/guide/performance)送信します。

## 選ぶときの考え方 {#picking-one}

**まずはユーザーがどこにいるかから。** グローバルなプロバイダーはほぼすべての国に届きますが、自国内では現地のゲートウェイのほうが安く、信頼性も高いことがよくあります。ナイジェリアでは、[Termii](/ja/providers/termii) と [Sendchamp](/ja/providers/sendchamp) が、多くの海外の送信元をブロックする DND（Do-Not-Disturb）規制を回避するルートを持っています。インドでは [MSG91](/ja/providers/msg91) が DLT 登録に対応しています。ネパールでは [Sparrow SMS](/ja/providers/sparrow) が両方の通信事業者に直接接続しています。

**次に、何を送るのかを考えます。**

- *ログインコードやアラート*は、料金の安さよりも速さと確実さが大事です。Twilio、Sinch、Vonage、Infobip は、通信事業者との直接接続がもっとも充実しています。
- *大規模なお知らせ*には、全員に 1 回のリクエストで送れる一括送信対応のプロバイダーが向いています。Sinch、Plivo、Infobip、ClickSend、Clickatell などです。
- お客様から返信が来るような*やり取り*には、[WhatsApp](/ja/providers/whatsapp) か、双方向の番号と配信 Webhook を備えたプロバイダーが適しています。

**そして、すでに使っているものも考慮に入れましょう。** AWS を使っているなら、[Amazon SNS](/ja/providers/aws-sns) の料金は既存のアカウントに請求されます。Brevo でメールを送っているなら、Brevo の [SMS](/ja/providers/brevo) も同じダッシュボードで管理できます。

::: tip 1 つの回線に頼らない
どれを選んだとしても、[フェイルオーバー](/ja/guide/failover)で 2 つ目のプロバイダーを控えさせておきましょう。障害はめったに起きませんが、起きたときでもログインコードは届き続けます。
:::

## 送信元 ID と登録 {#sender-ids-and-registration}

いまではほとんどの国で、アプリケーションから人への SMS（A2P）を大規模に送るには、事前に何らかの登録が必要です。

- **米国：** 10DLC のブランドおよびキャンペーン登録、または認証済みのフリーダイヤル番号
- **インド：** 送信元 ID とすべてのメッセージテンプレートの DLT 登録
- **その他の多くの国**では、英数字の送信元 ID を事前に登録する必要があります。

手続きはプロバイダーが案内してくれます。リリースまでに数日の余裕を見ておいてください。

## 開発とテスト用 {#for-development-and-tests}

| ドライバー | 用途 |
|---|---|
| [`log`](/ja/providers/log) | ローカル開発。メッセージを送信する代わりに Laravel のログに書き出します。 |
| [`fake`](/ja/guide/testing) | 自動テスト。アサーションには `Sms::fake()` を使います。 |
| [`failover`](/ja/guide/failover) | 実際のプロバイダーをチェーンでつなぎ、耐障害性を高めます。 |
