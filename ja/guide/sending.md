# メッセージを組み立てる

<p class="lead">送信はいつも <code>Sms</code> ファサードから始まり、4 つの送信メソッドのいずれかで終わります。その間に書くのは、メッセージの中身です。</p>

## ビルダー {#the-builder}

`Sms::to()`、`Sms::provider()`、`Sms::message()`、`Sms::template()` のどれを呼んでも、新しい `PendingSms` が返ります。必要なメソッドをチェーンでつなぎ、最後に送信メソッドを呼びます。

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // 省略可。省略すると SMS_PROVIDER を使用
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // 省略可。設定済みの送信元を上書き
    ->message('Doors open at 7pm.')
    ->send();
```

| メソッド | 動作 | 戻り値 |
|---|---|---|
| `send()` | すぐに送信する。`SMS_QUEUE=true` のときはキューに入れる | `SmsResult`。キューに入れた場合は `null` |
| `sendNow()` | 常にその場で送信する | `SmsResult`（リスナーがキャンセルした場合は `null`） |
| `sendLater()` | 常にキューに入れる | なし |
| `sendLaterAt($when)` | 遅延を付けてキューに入れる（`later()` はエイリアス） | なし |

ファサードを呼ぶたびに新しいビルダーが作られるので、長時間動く Octane ワーカーの中であっても、2 回の送信で宛先や本文が混ざることはありません。

## 宛先 {#recipients}

`to()` には番号 1 件、配列、またはコレクションを含む任意の iterable を渡せます。

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

番号は追加した時点で整形され、チェックされます。

- スペース、ハイフン、ドット、括弧は取り除かれます。
- 残った文字列は 7〜15 桁の数字でなければなりません（先頭の `+` は任意）。それ以外の場合は、プロバイダー側で後から失敗するのではなく、その場で `InvalidMessageException` がスローされます。
- 重複は取り除かれるので、1 回の送信で同じ人に 2 通届くことはありません。

::: tip E.164 形式を使う
番号は国際形式（`+` の後に国番号と番号）で保存し、その形式で送信してください。ローカル形式の番号をそのまま拒否するプロバイダーもあれば、別の国にルーティングしてしまうプロバイダーもあります。
:::

## 本文 {#text}

```php
Sms::to($phone)->message('Your table is ready.');
```

本文は前後の空白が取り除かれ、空にはできません。最大 1,600 文字まで送れます。SMS 1 通分（GSM 文字で 160 文字、絵文字などの Unicode を含む場合は 70 文字）を超えると、プロバイダーは複数のパートに分割し、パートごとに課金します。短いメッセージほど安く済むということです。

Laravel の通知と同じ呼び方がよければ、`message()` のエイリアスとして `content()` も使えます。

## テンプレート {#templates}

プロバイダーによっては、自由な本文ではなく事前に承認されたテンプレートで送信します。インドでは DLT 規制によってテンプレートが義務付けられており、WhatsApp でも企業側から始める会話ではテンプレートが必須です。

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

テンプレートに対応しているのは [MSG91](/ja/providers/msg91)、[WhatsApp](/ja/providers/whatsapp)、[Brevo](/ja/providers/brevo) です。それ以外のプロバイダーには本文が必要で、テンプレートだけのメッセージを送ろうとすると、プロバイダー名を示した `InvalidMessageException` がスローされます。

## 送信元 {#sender}

各プロバイダーには、電話番号や `ACME` のような英数字 ID などの送信元が設定されています。特定のメッセージだけ送信元を変えたいときは `from()` で上書きします。

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

英数字の送信元はどこでも使えるわけではありません。米国とカナダでは登録済みの番号から送信する必要があります。送信先の国ごとに、プロバイダーのルールを確認してください。

## プロバイダーを選ぶ {#choosing-a-provider}

`provider()` を使うと、デフォルトではなく指定したプロバイダーからそのメッセージを送信します。

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

特別な名前が 2 つあります。`failover` は複数のプロバイダーを順番に試し、`random` はプールの中から 1 つを選びます。どちらも[フェイルオーバーと負荷分散](/ja/guide/failover)で説明しています。

## 条件付きで組み立てる {#conditional-parts}

`PendingSms` は Laravel の `when()` と `unless()` に対応しています。

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## メッセージを先に組み立てておく {#building-a-message-ahead-of-time}

`SmsMessage` はただのオブジェクトなので、組み立てて受け渡し、後から送信できます。

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## マクロ {#macros}

繰り返し送るメッセージには、専用の名前を付けておきましょう。

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Sms::macro('sendOtp', function (string $phone, int $code) {
        return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
    });
}

// アプリのどこからでも
Sms::sendOtp($user->phone, 4821);
```
