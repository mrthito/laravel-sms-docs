# Clickatell

<p class="lead">アフリカや新興国市場を広くカバーする、老舗のゲートウェイです。Clickatell One API を使います。</p>

| | |
|---|---|
| ドライバーキー | `clickatell` |
| 対応地域 | グローバル |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.clickatell.com](https://www.clickatell.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=
CLICKATELL_FROM=
```

| 変数 | |
|---|---|
| `CLICKATELL_API_KEY` | One API インテグレーションの API キー |
| `CLICKATELL_FROM` | 任意の送信元（アカウントで承認済みのものがある場合） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=clickatell
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clickatell')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- Clickatell は 1 リクエストにつき宛先 100 件まで受け付けます。それより多い場合は自動的にバッチに分割されます。
- 宛先ごとに受付・拒否が判定され、拒否は番号ごとに報告されます。
