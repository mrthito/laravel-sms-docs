# 1.x からのアップグレード

<p class="lead">バージョン 2 では、true / false ではなく送信結果を中心にコアを作り直しました。ほとんどのアプリケーションは最初の 3 ステップだけで済み、30 分ほどで終わります。</p>

## 1. パッケージを更新する {#_1-update-the-package}

```bash
composer require mr-rijal/laravel-sms:^2.0
```

**AWS SNS** ドライバーを使っている場合、AWS SDK は自動ではインストールされなくなりました。

```bash
composer require aws/aws-sdk-php
```

## 2. 設定ファイルを公開し直すか、マージする {#_2-re-publish-or-merge-the-config}

```bash
php artisan vendor:publish --tag=sms-config --force
```

`config/sms.php` をカスタマイズしている場合は、次の変更を手作業でマージしてください。

- `default` のフォールバック先が `fake` から `log` に変わりました。
- 新しいセクション：`retry`、`http`、`providers.failover`
- 新しいプロバイダー：`sinch`、`bird`、`clicksend`、`clickatell`、`brevo`、`bandwidth`、`sendpulse`
- 削除されたプロバイダー：`telegram_mirror`、`discord_webhook`、`slack_webhook`

## 3. true / false の代わりに送信結果を受け取る {#_3-send-results-instead-of-booleans}

`send()`、`sendNow()`、および `HasSms` のヘルパーは、`bool` ではなく `?SmsResult` を返すようになりました。

```php
// 1.x
if (Sms::to($n)->message('Hi')->sendNow()) { ... }

// 2.0
$result = Sms::to($n)->message('Hi')->sendNow();
$result?->firstId();
```

`SmsSending` リスナーが送信をキャンセルした場合と、`send()` がメッセージをキューに入れた場合、結果は `null` になります。失敗したときは 1.x と同じく例外がスローされます。

## 削除されたドライバー {#removed-drivers}

Telegram、Discord、Slack のミラードライバーは削除しました。そもそも SMS を届けるものではなかったためです。社内向けの通知に使っていた場合は、代わりに `SmsSent` イベントをリッスンし、Laravel の通知でそれぞれのチャネルに投稿してください。

## 例外 {#exceptions}

プロバイダー側の失敗では `MrRijal\LaravelSms\Exceptions\DeliveryException`（これまでどおり `RuntimeException` のサブクラス）がスローされます。不正な入力では `InvalidMessageException`、設定の誤りでは `InvalidConfigurationException` がスローされます（どちらもこれまでどおり `InvalidArgumentException` のサブクラス）。`MrRijal\LaravelSms\Exceptions\SmsException` を catch すれば、これらすべてをまとめて扱えます。

`DeliveryException::$failedRecipients` と `DeliveryException::$partial` で、誰に届き、誰に届かなかったのかがわかります。

## イベント {#events}

- `SmsSent` から `success` と `error` プロパティがなくなりました。成功したときだけディスパッチされ、`result`（`SmsResult`）を持ちます。
- 失敗したときは、新しい `SmsFailed` イベントが `exception` 付きでディスパッチされます。
- `SmsSending` リスナーから `false` を返して送信をキャンセルできるようになりました。

## 通知 {#notifications}

`toSms()` は、自分でメッセージを送信するのではなく、`SmsMessage`（または文字列）を**返す**ようにしてください。チャネルは `routeNotificationForSms()` を使ってルーティングし、`Notification::route('sms', $number)` にも対応しています。

```php
// 1.x
public function toSms($notifiable): void
{
    Sms::to($notifiable->phone)->message('Shipped')->sendNow();
}

// 2.0
public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create('Shipped');
}
```

`SmsNotification` は `sms.queue` を参照しなくなりました。通知をキューに入れるには、ほかの Laravel の通知と同じように、通知クラスに `ShouldQueue` を実装してください。

## ファサードとマネージャー {#facade-and-manager}

- `Sms::to()`、`Sms::provider()`、`Sms::message()`、`Sms::template()` は呼ぶたびに新しい `PendingSms` を返すようになったので、送信の間で状態が共有されることはありません。
- `Sms::sendMessage($message, $provider)` は `Sms::sendNow($message->provider($provider))` に置き換わりました。
- `SmsManager` はコンテナを受け取って生成されます。`new SmsManager` とするのではなく、コンテナから解決してください（`app(SmsManager::class)`）。

## カスタムドライバー {#custom-drivers}

`SmsProvider::send()` は `SmsResult` を返す必要があります。

```php
public function send(SmsMessage $message): SmsResult
{
    // ... プロバイダーを呼び出す ...

    return SmsResult::accepted($message->getTo(), $providerMessageId);
}
```

`MrRijal\LaravelSms\Drivers\HttpDriver` を継承すれば、設定のバリデーション、タイムアウト、並列送信、一部失敗の処理、安全なエラーメッセージがすべて手に入ります。ドライバーは Laravel の HTTP クライアントを使うようになったため、コンストラクターで Guzzle の `Client` は受け取れなくなりました。テストでは `Http::fake()` を使ってください。

## テスト {#testing}

`FakeDriver::$messages` を使ったアサーションは `Sms::fake()` に置き換えてください。

```php
Sms::fake();
// ...
Sms::assertSentTo('+15551234567');
```

`FakeDriver` は、それに依存しているアプリのために残してあります。
