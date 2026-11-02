# テンプレート

<p class="lead">自由な本文では送れないメッセージもあります。インドでは商用の SMS はすべて登録済みのテンプレートに沿っていなければならず、WhatsApp でも企業から会話を始められるのは承認済みのテンプレートだけです。このページでは、テンプレートの準備と送信の方法を説明します。</p>

## テンプレートが必要になる場面 {#when-you-need-a-template}

| 場面 | 理由 |
|---|---|
| インドの番号に送る | DLT 規制により、商用メッセージはすべて通信事業者に登録したテンプレートに沿っている必要がある |
| WhatsApp で会話を始める | お客様の最後のメッセージから 24 時間を過ぎると、WhatsApp は承認済みのテンプレートしか配信しない |
| 文面をコードから切り離す | マーケティングやサポートのチームが、デプロイなしでプロバイダーのダッシュボードから文言を編集できる |

テンプレートに対応しているのは **[MSG91](/ja/providers/msg91)**、**[WhatsApp](/ja/providers/whatsapp)**、**[Brevo](/ja/providers/brevo)** です。それ以外のプロバイダーは本文を送信します。

## テンプレートを送る {#sending-a-template}

テンプレートの ID と変数を渡します。

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

ID と変数の意味は、プロバイダーごとに少しずつ異なります。

## プロバイダーごとの解釈 {#how-each-provider-reads-them}

### MSG91 {#msg91}

ID は MSG91 のダッシュボードにある **Flow ID** です。変数名は Flow 内の変数と一致させる必要があり、すべての宛先に同じ値が送られます。

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

すべての宛先に 1 回のリクエストで送信されます。送信元 ID（`MSG91_SENDER`）は、テンプレートと合わせて DLT に登録しておく必要があります。

### WhatsApp {#whatsapp}

ID は WhatsApp Manager に表示されているとおりの**テンプレート名**です。変数はテンプレート本文のプレースホルダーに**順番に**埋め込まれます。1 つ目の値が <code v-pre>{{1}}</code> に、2 つ目が <code v-pre>{{2}}</code> に、という具合です。配列のキーは、コードを読みやすくするためだけのものです。

```php
// テンプレート "order_update": "Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

どのメッセージも `WHATSAPP_TEMPLATE_LANGUAGE`（デフォルトは `en`）で設定した言語を使います。`en_US` や `pt_BR` など、テンプレートが承認された言語と一致していなければなりません。

::: info 本文のみに対応
ドライバーが埋めるのは本文のプレースホルダーだけです。ヘッダーのメディアや URL ボタンなど、ほかのコンポーネントを含むテンプレートには、WhatsApp API を直接使うか、[カスタムドライバー](/ja/guide/custom-drivers)が必要です。
:::

### Brevo {#brevo}

ID は Brevo の **SMS テンプレート ID** で、変数はテンプレートの `params` になります。

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## 本文へのフォールバック付きテンプレート {#templates-with-a-text-fallback}

1 つのメッセージにテンプレート**と**本文の両方を持たせることができます。テンプレートに対応したプロバイダーはテンプレートを、それ以外のプロバイダーは本文を送信します。これで、テンプレートを[フェイルオーバー](/ja/guide/failover)と安全に組み合わせられます。

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

MSG91 は DLT テンプレートを送信します。MSG91 が使えないときは、代わりに Twilio が本文を送信します。

テンプレートだけのメッセージを本文のみ対応のプロバイダーに送ろうとすると、何かが送信される前に、プロバイダー名を示した `InvalidMessageException` がスローされます。フェイルオーバーチェーンの中では、そのプロバイダーは単に飛ばされます。

## テンプレート ID をコードに直書きしない {#keeping-template-ids-out-of-your-code}

テンプレート ID は意味の読み取れない文字列で、打ち間違えやすいものです。Backed Enum を使えば、各テンプレートに名前が付き、補完が効き、変更する場所も 1 か所にまとまります。

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

環境ごとに ID が異なる場合は、`config/services.php` に置いて `config('services.msg91.templates.login_code')` で読み込むようにしてください。

## 通知でテンプレートを使う {#templates-in-notifications}

`toSms()` は、ほかのメッセージと同じようにテンプレートメッセージを返せます。

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

用意済みの通知クラスを使うこともできます。

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## テンプレートメッセージをテストする {#testing-template-messages}

`Sms::fake()` はテンプレート ID と変数も記録するので、それらに対してアサーションを書けます。

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
