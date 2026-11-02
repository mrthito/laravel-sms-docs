# Bird

<p class="lead">旧社名 MessageBird です。このドライバーは、ワークスペースの API キーを使う Bird の現行 SMS API に対応しています。</p>

| | |
|---|---|
| ドライバーキー | `bird` |
| 対応地域 | グローバル |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [bird.com](https://bird.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=
BIRD_FROM=
BIRD_REGION=
BIRD_CATEGORY=
```

| 変数 | |
|---|---|
| `BIRD_API_KEY` | ワークスペースの API キー（`bk_` で始まる） |
| `BIRD_FROM` | 送信元の番号または英数字 ID |
| `BIRD_REGION` | `us1`（デフォルト）または `eu1`。キーと一致させること |
| `BIRD_CATEGORY` | `transactional`（デフォルト）、`marketing`、`authentication`、`service` のいずれか |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=bird
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bird')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- キーはリージョンに紐付いています。`bk_eu1_…` のキーは `BIRD_REGION=eu1` でしか使えません。
- `BIRD_CATEGORY` は実態に合わせて正しく設定してください。マーケティング目的の送信には、異なるルールや料金を適用する国がいくつもあります。
- 旧 MessageBird の `AccessKey` 認証情報には対応していません。Bird のダッシュボードでワークスペースキーを作成してください。
