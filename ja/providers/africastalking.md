# Africa's Talking

<p class="lead">アフリカ 20 か国以上の通信事業者と直接つながっています。開発用の無料サンドボックスも用意されています。</p>

| | |
|---|---|
| ドライバーキー | `africastalking` |
| 対応地域 | アフリカ全域 |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 対応 |
| Web サイト | [africastalking.com](https://africastalking.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=
AFRICASTALKING_FROM=
AFRICASTALKING_SANDBOX=
```

| 変数 | |
|---|---|
| `AFRICASTALKING_API_KEY` | API キー |
| `AFRICASTALKING_USERNAME` | アプリのユーザー名（テスト中は `sandbox`） |
| `AFRICASTALKING_FROM` | 任意。送信元 ID またはショートコード |
| `AFRICASTALKING_SANDBOX` | サンドボックス API を使う場合は `true` |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +254711123456 --provider=africastalking
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('africastalking')
    ->to('+254711123456')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- サンドボックスモードでは、メッセージは本物の電話ではなく Africa's Talking のシミュレーターに表示されます。`AFRICASTALKING_USERNAME=sandbox` と `AFRICASTALKING_SANDBOX=true` はセットで設定してください。
- Africa's Talking は宛先ごとのステータスを返します。残高不足などで拒否された番号は、`DeliveryException` に列挙されます。

## 配信レポート {#delivery-reports}

Africa's Talking の配信レポートの送信先 URL を `https://your-app.com/laravel-sms/webhook/africastalking` に設定し、[Webhook](/ja/guide/webhooks) を有効にしてください。Africa's Talking はコールバックに署名しないため、リクエストはコールバック URL に含めた `?token=` のシークレット（`AFRICASTALKING_WEBHOOK_SECRET`）で検証されます。

検証を通過したレポートは、`SmsWebhookReceived` イベントを発火します。
