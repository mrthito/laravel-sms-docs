# BulkSMS

<p class="lead">すべての宛先を 1 回の JSON リクエストで送信する、シンプルなグローバルゲートウェイです。</p>

| | |
|---|---|
| ドライバーキー | `bulksms` |
| 対応地域 | グローバル（南部アフリカに強い） |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 対応 |
| Web サイト | [www.bulksms.com](https://www.bulksms.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=
BULKSMS_TOKEN_SECRET=
BULKSMS_FROM=
```

| 変数 | |
|---|---|
| `BULKSMS_TOKEN_ID` | API トークン ID |
| `BULKSMS_TOKEN_SECRET` | API トークンシークレット |
| `BULKSMS_FROM` | 任意の送信元（アカウントにある場合） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=bulksms
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bulksms')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- トークンは *Settings → API Tokens* で作成します。ドライバーはそれを HTTP Basic 認証で使います。

## 配信レポート {#delivery-reports}

BulkSMS の配信レポートの送信先 URL を `https://your-app.com/laravel-sms/webhook/bulksms` に設定し、[Webhook](/ja/guide/webhooks) を有効にしてください。リクエストは `BULKSMS_WEBHOOK_SECRET` を使い、`X-BulkSMS-Signature` の HMAC-SHA256 で検証されます。

検証を通過したレポートは、`SmsWebhookReceived` イベントを発火します。
