# Termii

<p class="lead">ナイジェリアで人気のプラットフォームです。DND 規制に対応したルートを持ち、同じアカウントから WhatsApp でも配信できます。</p>

| | |
|---|---|
| ドライバーキー | `termii` |
| 対応地域 | ナイジェリア・アフリカ |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 対応 |
| Web サイト | [termii.com](https://termii.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=
TERMII_SENDER_ID=
TERMII_CHANNEL=
TERMII_BASE_URL=
```

| 変数 | |
|---|---|
| `TERMII_API_KEY` | API キー |
| `TERMII_SENDER_ID` | 承認済みの送信元 ID |
| `TERMII_CHANNEL` | `generic`（デフォルト）、DND（Do-Not-Disturb）登録番号向けの `dnd`、または `whatsapp` |
| `TERMII_BASE_URL` | 任意。Termii ダッシュボードに表示されるアカウントのベース URL（HTTPS のみ） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +2348012345678 --provider=termii
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('termii')
    ->to('+2348012345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- OTP のようなトランザクションメッセージには `dnd` チャネルを使ってください。ナイジェリアでは、`generic` ルートだと DND に登録した番号には届きません。
- Termii はリクエスト本文に含めた API キーで認証します。ドライバーはそれを HTTPS でのみ送信します。

## 配信レポート {#delivery-reports}

Termii の配信レポートの送信先 URL を `https://your-app.com/laravel-sms/webhook/termii` に設定し、[Webhook](/ja/guide/webhooks) を有効にしてください。リクエストは `TERMII_WEBHOOK_SECRET` を使い、`X-Termii-Signature` の HMAC-SHA512 で検証されます。

検証を通過したレポートは、`SmsWebhookReceived` イベントを発火します。
