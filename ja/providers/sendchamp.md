# Sendchamp

<p class="lead">DND、非 DND、国際の各ルートを持つ、ナイジェリアのコミュニケーションプラットフォームです。すべての宛先を 1 回のリクエストで送信します。</p>

| | |
|---|---|
| ドライバーキー | `sendchamp` |
| 対応地域 | ナイジェリア・アフリカ |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 対応 |
| Web サイト | [sendchamp.com](https://sendchamp.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=
SENDCHAMP_SENDER_NAME=
SENDCHAMP_ROUTE=
```

| 変数 | |
|---|---|
| `SENDCHAMP_API_KEY` | 公開アクセスキー |
| `SENDCHAMP_SENDER_NAME` | 承認済みの送信者名 |
| `SENDCHAMP_ROUTE` | `dnd`（デフォルト）、`non_dnd`、`international` のいずれか |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +2348012345678 --provider=sendchamp
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendchamp')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- ログインコードのように急ぎのメッセージは、`dnd` ルートのままにしておきましょう。DND（Do-Not-Disturb）に登録した番号にも届きます。

## 配信レポート {#delivery-reports}

Sendchamp の配信レポートの送信先 URL を `https://your-app.com/laravel-sms/webhook/sendchamp` に設定し、[Webhook](/ja/guide/webhooks) を有効にしてください。リクエストは `SENDCHAMP_WEBHOOK_SECRET` を使い、`X-Sendchamp-Signature` の HMAC-SHA256 で検証されます。

検証を通過したレポートは、`SmsWebhookReceived` イベントを発火します。
