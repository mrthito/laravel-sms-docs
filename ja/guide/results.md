# 送信結果とエラー

<p class="lead">SMS は届いてはじめて意味があります。送信のたびに、プロバイダーが何を受け付けたのか、そして問題が起きたときにはどの宛先が影響を受けたのかが正確にわかります。</p>

## 送信結果 {#the-result}

`sendNow()` は `SmsResult` を返します。

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
    $sent->status;  // "queued"（プロバイダーが返したステータス）
}
```

メッセージ ID は保存しておきましょう。プロバイダーの配信レポートを引くときも、サポートへの問い合わせ（「メッセージ SM1a… はどうなりましたか？」）でも、[Webhook](/ja/guide/webhooks) をそのきっかけとなったメッセージに紐付けるときも、この ID が手がかりになります。

::: info 受け付けられた ≠ 届いた
送信結果が返ったということは、プロバイダーがメッセージを**受け付けた**ということです。端末に届くのは数秒後で、電源が切れていたり番号が変わっていたりすれば、その時点で失敗することもあります。最終的に届いたかどうかは [Webhook](/ja/guide/webhooks) で追跡してください。
:::

`sendNow()` が `null` を返すのは、[`SmsSending` リスナー](/ja/guide/events#cancelling-a-send)が送信をキャンセルした場合だけです。`send()` は、送信せずにキューに入れた場合にも `null` を返します。

## プロバイダーに拒否されたとき {#when-a-provider-says-no}

送信が拒否されたり、プロバイダーに接続できなかったりすると、`DeliveryException` がスローされます。メッセージは人が読める内容で、そのままログに残しても安全です。

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

プロバイダー自身の説明も 200 文字までに切り詰めて含まれます。認証情報が含まれることは決してありません。

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400（HTTP ステータスがある場合）
    $e->failedRecipients;       // プロバイダーが受け付けなかった番号
    $e->partial?->recipients(); // 失敗する前に受け付けられた番号
}
```

## 一部だけ失敗したとき {#partial-failures}

100 人に送れば、そのうち 1 件の番号が無効ということもあるでしょう。このパッケージは、送信全体が失敗したかのように扱うことも、失敗した 1 件を隠すこともしません。

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 99 人にはもう届いている。この人たちに再送しないこと
        $delivered = $e->partial->recipients();
    }

    // リトライ、フラグ付け、報告はこの番号だけを対象に
    $e->failedRecipients;
}
```

例外メッセージにも失敗した件数が含まれます：`… (1 of 100 recipients failed)`。

[フェイルオーバー](/ja/guide/failover)を安全に使えるのもこの仕組みのおかげです。次のプロバイダーが受け取るのは、常に `failedRecipients` だけです。

## このパッケージがスローする例外 {#every-exception-the-package-throws}

どの例外も `MrRijal\LaravelSms\Exceptions\SmsException` を実装しているので、`catch` 1 つでパッケージ全体の例外を受け止められます。

| 例外 | 継承元 | スローされる場面 |
|---|---|---|
| `DeliveryException` | `RuntimeException` | プロバイダーがメッセージを拒否した、接続できなかった、または認証に失敗した |
| `InvalidMessageException` | `InvalidArgumentException` | 番号の形式が正しくない、本文が空または長すぎる、あるいはプロバイダーがその種類のメッセージを送れない |
| `InvalidConfigurationException` | `InvalidArgumentException` | プロバイダーが不明、または認証情報や設定が不足しているか正しくない |

メッセージや設定の誤りは、何かが送信される**前に**エラーになります。中途半端なミスに料金を払うことはありません。
