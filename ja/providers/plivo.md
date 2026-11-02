# Plivo

<p class="lead">コストパフォーマンスのよいグローバルプロバイダーで、REST API もシンプルです。すべての宛先を 1 回のリクエストで送信します。</p>

| | |
|---|---|
| ドライバーキー | `plivo` |
| 対応地域 | グローバル |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.plivo.com](https://www.plivo.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM=
PLIVO_LOG_MESSAGES=
```

| 変数 | |
|---|---|
| `PLIVO_AUTH_ID` | Auth ID |
| `PLIVO_AUTH_TOKEN` | Auth Token |
| `PLIVO_FROM` | 送信元の番号または英数字 ID |
| `PLIVO_LOG_MESSAGES` | 任意、デフォルトは `false`。Plivo がメッセージ本文と番号をログに保存するかどうか |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=plivo
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('plivo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- このドライバーでは、Plivo 側の本文ログ機能はデフォルトで**オフ**になっているので、メッセージ本文が Plivo のダッシュボードに残ることはありません。デバッグで必要な場合にだけオンにしてください。
- 宛先ごとに Plivo のメッセージ UUID が発行され、宛先と同じ順番で並びます。
