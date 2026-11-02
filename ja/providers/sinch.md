# Sinch

<p class="lead">多くの国の通信事業者と直接つながっている、キャリアグレードのプラットフォームです。すべての宛先を 1 回のバッチリクエストで送信します。</p>

| | |
|---|---|
| ドライバーキー | `sinch` |
| 対応地域 | グローバル |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [sinch.com](https://sinch.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=
SINCH_API_TOKEN=
SINCH_FROM=
SINCH_REGION=
```

| 変数 | |
|---|---|
| `SINCH_SERVICE_PLAN_ID` | SMS ダッシュボードのサービスプラン ID |
| `SINCH_API_TOKEN` | そのサービスプランの API トークン |
| `SINCH_FROM` | 送信元の番号または英数字 ID |
| `SINCH_REGION` | `us`（デフォルト）、`eu`、`au`、`br`、`ca` のいずれか。アカウントのリージョンと一致させること |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=sinch
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sinch')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- サービスプランを作成したリージョンを指定してください。一致していないと、トークンが正しくても `401` が返ります。
- バッチ全体で 1 つの Sinch バッチ ID を共有します。この ID は `$result->firstId()` で取得できます。
