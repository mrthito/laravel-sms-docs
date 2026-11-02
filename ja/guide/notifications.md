# 通知

<p class="lead">すでに Laravel の通知でメールを送っているなら、SMS はチャネルが 1 つ増えるだけです。パッケージは <code>sms</code> という名前でチャネルを登録します。</p>

## 通知を書く {#writing-a-notification}

`via()` に `sms` を追加し、`toSms()` からメッセージを返します。

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use MrRijal\LaravelSms\SmsMessage;

class OrderShipped extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'sms'];
    }

    public function toSms(object $notifiable): SmsMessage
    {
        return SmsMessage::create("Order #{$this->order->id} is on its way.")
            ->from('ACME');
    }
}
```

本文だけで十分なら、`toSms()` からただの文字列を返してもかまいません。

```php
public function toSms(object $notifiable): string
{
    return 'Your password was changed.';
}
```

SMS 通知をキューに入れるには、ほかの Laravel の通知と同じように、通知クラスに `ShouldQueue` を実装します。Laravel は notifiable とチャネルの組み合わせごとにジョブを 1 つ作るので、SMS とメールはそれぞれ独立してリトライされます。

`viaQueues()` を使えば、SMS のジョブを専用のキューに振り分けられます。

```php
public function viaQueues(): array
{
    return [
        'mail' => 'default',
        'sms' => 'sms',
    ];
}
```

Laravel 13 では、リトライ回数の上限を属性で宣言できます。

```php
use Illuminate\Queue\Attributes\Tries;

#[Tries(3)]
class OrderShipped extends Notification implements ShouldQueue
{
    // …
}
```

データベースのトランザクション内で通知を送る場合は、`afterCommit()` をつないでおきましょう。ロールバックされた注文について SMS が送られてしまうことがなくなります。

```php
$user->notify((new OrderShipped($order))->afterCommit());
```

## 電話番号へのルーティング {#routing-to-a-phone-number}

チャネルは送信先を notifiable に問い合わせます。モデルに `routeNotificationForSms()` を追加してください。

```php
class User extends Authenticatable
{
    use Notifiable;

    public function routeNotificationForSms(Notification $notification): ?string
    {
        return $this->phone;
    }
}
```

`null` や空文字列を返した場合、その SMS は何も言わずにスキップされます。電話番号を登録していないユーザーがいる場合に便利です。

メッセージにすでに宛先が設定されている場合は、ルーティングを行わずにその宛先へ送信します。

### オンデマンド通知 {#on-demand-notifications}

データベースにユーザーとして登録されていない相手にも通知を送れます。

```php
use Illuminate\Support\Facades\Notification;

Notification::route('sms', '+15551234567')->notify(new OrderShipped($order));
```

## 用意済みの通知クラス {#the-ready-made-notification}

一度きりのメッセージなら、`SmsNotification` を使えばクラスを書く手間が省けます。

```php
use MrRijal\LaravelSms\Notifications\SmsNotification;

$user->notify(new SmsNotification(message: 'Welcome aboard!'));

$user->notify(new SmsNotification(
    templateId: 'otp',
    variables: ['code' => 4821],
    provider: 'msg91',
));
```

## HasSms トレイト {#the-hassms-trait}

モデルから手軽に送信したいときは、`HasSms` を追加します。

```php
use MrRijal\LaravelSms\Traits\HasSms;

class User extends Authenticatable
{
    use HasSms, Notifiable;

    public function routeNotificationForSms(?Notification $notification = null): string
    {
        return $this->phone;
    }
}

$user->sms('Your order has shipped.');
$user->smsTemplate('otp', ['code' => 4821]);
```

どちらもその場で送信し、`SmsResult` を返します。トレイトを使う場合は、上の例のように `$notification` 引数を省略可能にしておいてください。そうすれば、同じメソッドを通知とヘルパーの両方で使えます。
