# 設定

<p class="lead"><code>config/sms.php</code> のすべての項目と、それを設定する環境変数の一覧です。ファイルは <code>php artisan vendor:publish --tag=sms-config</code> で公開できますが、編集が必要になることはめったにありません。</p>

## 送信 {#sending}

| オプション | 環境変数 | デフォルト | |
|---|---|---|---|
| `default` | `SMS_PROVIDER` | `log` | メッセージでプロバイダーが指定されていないときに使うプロバイダー。`failover` と `random` も指定できる。 |
| `random_drivers` | — | `['twilio', 'msg91']` | `random` が選ぶ候補のプール。 |
| `providers.failover.drivers` | `SMS_FAILOVER_DRIVERS` | `twilio,vonage` | `failover` のチェーン。カンマ区切りで、先頭から順に試す。 |

## キュー {#queueing}

| オプション | 環境変数 | デフォルト | |
|---|---|---|---|
| `queue` | `SMS_QUEUE` | `false` | `true` にすると、`send()` はすぐに送信せずキューに入れる。 |
| `queue_connection` | `SMS_QUEUE_CONNECTION` | アプリのデフォルト | SMS ジョブ用のキュー接続。 |
| `queue_name` | `SMS_QUEUE_NAME` | アプリのデフォルト | SMS ジョブ用のキュー名。 |
| `retry.tries` | `SMS_QUEUE_TRIES` | `3` | ジョブが失敗とみなされるまでの、宛先ごとの試行回数。 |
| `retry.timeout` | `SMS_QUEUE_TIMEOUT` | `120` | ジョブの最大実行秒数。キューの `retry_after` はこれより長くすること。 |
| `retry.backoff` | — | `[10, 30, 60]` | 各リトライ前に待つ秒数。 |

## HTTP {#http}

| オプション | 環境変数 | デフォルト | |
|---|---|---|---|
| `http.timeout` | `SMS_HTTP_TIMEOUT` | `30` | プロバイダーの応答を待つ秒数。 |
| `http.connect_timeout` | `SMS_HTTP_CONNECT_TIMEOUT` | `10` | 接続を待つ秒数。 |
| `http.concurrency` | `SMS_HTTP_CONCURRENCY` | `10` | 宛先ごとに送るプロバイダーでの同時リクエスト数。 |

## Webhook {#webhooks}

| オプション | 環境変数 | デフォルト | |
|---|---|---|---|
| `webhooks.enabled` | `SMS_WEBHOOKS_ENABLED` | `false` | Webhook のルートを登録する。 |
| `webhooks.prefix` | `SMS_WEBHOOKS_PREFIX` | `laravel-sms/webhook` | URL のプレフィックス。後ろにプロバイダーキーが付く。 |
| `webhooks.middleware` | — | `['api', 'throttle:120,1']` | ルートに適用するミドルウェア。 |
| `webhooks.whatsapp.secret` | `WHATSAPP_WEBHOOK_SECRET` | — | Meta のアプリシークレット。 |
| `webhooks.whatsapp.verify_token` | `WHATSAPP_VERIFY_TOKEN` | — | Meta のサブスクリプション確認用のトークン。 |
| `webhooks.termii.secret` | `TERMII_WEBHOOK_SECRET` | — | |
| `webhooks.sendchamp.secret` | `SENDCHAMP_WEBHOOK_SECRET` | — | |
| `webhooks.bulksms.secret` | `BULKSMS_WEBHOOK_SECRET` | — | |
| `webhooks.africastalking.secret` | `AFRICASTALKING_WEBHOOK_SECRET` | — | コールバック URL に `?token=` として付ける。 |

## ドライバーとプロバイダー {#drivers-and-providers}

2 つのマップで、プロバイダーキーとそのコード、認証情報を結び付けています。

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    // …
],

'providers' => [
    'twilio' => [
        'sid' => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from' => env('TWILIO_FROM'),
        'messaging_service_sid' => env('TWILIO_MESSAGING_SERVICE_SID'),
    ],
    // …
],
```

`drivers` はキーをどのクラスが担当するかを決め、`providers` はそのキーの設定を保持してクラスに渡します。各設定項目は[プロバイダーのページ](/ja/providers/)に載っています。

同じプロバイダーを 2 つのアカウントで使いたい場合（たとえばトランザクション用とマーケティング用）は、同じクラスを別々のキーで 2 回登録します。

```php
'drivers' => [
    'twilio' => Drivers\TwilioDriver::class,
    'twilio_marketing' => Drivers\TwilioDriver::class,
],

'providers' => [
    'twilio_marketing' => [
        'sid' => env('TWILIO_MARKETING_SID'),
        'token' => env('TWILIO_MARKETING_TOKEN'),
        'from' => env('TWILIO_MARKETING_FROM'),
    ],
],
```

```php
Sms::provider('twilio_marketing')->to($subscribers)->message($newsletter)->sendLater();
```

## 設定のキャッシュ {#config-caching}

設定にはクロージャーが含まれていないので、`php artisan config:cache` はいつもどおり使えます。本番環境で `.env` を変更したら、もう一度実行してください。
