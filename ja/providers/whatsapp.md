# WhatsApp

<p class="lead">SMS と同じ API で、Meta の Cloud API を通じて WhatsApp メッセージを送信します。自由な本文と承認済みのテンプレートの両方に対応しています。</p>

| | |
|---|---|
| ドライバーキー | `whatsapp` |
| 対応地域 | グローバル |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 対応 |
| 配信 Webhook | 対応 |
| Web サイト | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_API_VERSION=
WHATSAPP_TEMPLATE_LANGUAGE=
WHATSAPP_DEFAULT_COUNTRY_CODE=
```

| 変数 | |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Manager の電話番号 ID |
| `WHATSAPP_ACCESS_TOKEN` | システムユーザーの永続アクセストークン |
| `WHATSAPP_API_VERSION` | 任意、デフォルトは `v21.0` |
| `WHATSAPP_TEMPLATE_LANGUAGE` | 任意、デフォルトは `en`。テンプレートの言語コード（例：`en_US`） |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | 任意。国番号なしで書かれた番号に付け加える |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=whatsapp
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('whatsapp')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- WhatsApp で自由な本文を送れるのは、お客様の最後のメッセージから 24 時間以内だけです。会話を始めるには、承認済みのテンプレートを送ってください：`->template('order_update', ['Ana', '#4821'])`。変数はテンプレート本文のパラメーターに順番に埋め込まれます。
- スタートガイドのページで発行される一時トークンは 1 日で期限が切れるので、使わないでください。システムユーザーのトークンを使いましょう。

## 配信レポート {#delivery-reports}

WhatsApp の配信レポートの送信先 URL を `https://your-app.com/laravel-sms/webhook/whatsapp` に設定し、[Webhook](/ja/guide/webhooks) を有効にしてください。リクエストは `X-Hub-Signature-256` の HMAC（`WHATSAPP_WEBHOOK_SECRET`）で検証され、Meta のサブスクリプション確認には `WHATSAPP_VERIFY_TOKEN` が使われます。

検証を通過したレポートは、`SmsWebhookReceived` イベントを発火します。
