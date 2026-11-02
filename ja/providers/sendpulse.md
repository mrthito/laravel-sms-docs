# SendPulse

<p class="lead">ヨーロッパや中南米で人気の、マルチチャネルのマーケティングプラットフォームです。認証には OAuth 2.0 を使い、すべての宛先を 1 回のリクエストで送信します。</p>

| | |
|---|---|
| ドライバーキー | `sendpulse` |
| 対応地域 | グローバル |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [sendpulse.com](https://sendpulse.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=
SENDPULSE_CLIENT_SECRET=
SENDPULSE_SENDER=
```

| 変数 | |
|---|---|
| `SENDPULSE_CLIENT_ID` | REST API の ID |
| `SENDPULSE_CLIENT_SECRET` | REST API のシークレット |
| `SENDPULSE_SENDER` | 承認済みの送信者名（11 文字まで） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=sendpulse
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sendpulse')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- アクセストークンは約 1 時間キャッシュされ、自動的に更新されます。
- 送信者名は、使う前に SendPulse のダッシュボードで承認を受ける必要があります。
