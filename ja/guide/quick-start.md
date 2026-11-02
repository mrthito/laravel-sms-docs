# 最初の SMS を送る

<p class="lead">送信、結果の確認、キュー、通知、テスト。いちばんよく使う 5 つの操作を順に見ていきます。</p>

## メッセージを送る {#send-a-message}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

番号にはスペース、ハイフン、ドット、括弧が含まれていてもかまいません。`+1 (555) 123-4567` と `+15551234567` は同じ宛先として扱われます。できるかぎり、先頭に `+` を付けた国際形式を使ってください。ほとんどのプロバイダーは、この形式でないとメッセージを正しくルーティングできません。

## 結果を確認する {#check-what-happened}

`sendNow()` はその場で送信し、`SmsResult` を返します。

```php
$result = Sms::to('+15551234567')->message('Hello')->sendNow();

$result->provider;   // "twilio"
$result->firstId();  // プロバイダーのメッセージ ID。保存しておくと役に立ちます
```

プロバイダーがメッセージを拒否した場合は、`DeliveryException` がその理由を教えてくれます。

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    Sms::to($phone)->message('Hello')->sendNow();
} catch (DeliveryException $e) {
    report($e); // "Failed to send SMS via Twilio (HTTP 400): The 'To' number is not valid."
}
```

一部の宛先だけが失敗した場合の扱いや、各プロパティの中身については[送信結果とエラー](/ja/guide/results)で説明しています。

## キューに入れる {#queue-it}

送信にはネットワークの往復が伴います。Web リクエストの中で送るなら、ユーザーを待たせないようにキューに入れましょう。

```php
Sms::to($user->phone)->message('Welcome aboard!')->sendLater();

Sms::to($user->phone)
    ->message('Your trial ends tomorrow.')
    ->sendLaterAt(now()->addDays(13));
```

## 通知として送る {#send-it-as-a-notification}

すでに Laravel の通知を使っているなら、`sms` チャネルを追加するだけです。

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

チャネルは `routeNotificationForSms()` を通じてモデルから電話番号を取得します。詳しくは[通知](/ja/guide/notifications)を参照してください。

## テストする {#test-it}

```php
use MrRijal\LaravelSms\Facades\Sms;

it('texts a login code', function () {
    Sms::fake();

    $this->post('/login', ['phone' => '+15551234567']);

    Sms::assertSentTo('+15551234567');
});
```

これがこのパッケージの中心となる部分です。このガイドの残りでは、[メッセージの組み立て方](/ja/guide/sending)から始めて、それぞれの機能をさらに詳しく見ていきます。
