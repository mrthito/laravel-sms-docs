# ClickSend

<p class="lead">オーストラリア、英国、米国で人気のプロバイダーです。ダッシュボードが見やすく、どのレスポンスにもメッセージごとのステータスが含まれます。</p>

| | |
|---|---|
| ドライバーキー | `clicksend` |
| 対応地域 | グローバル |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.clicksend.com](https://www.clicksend.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=
CLICKSEND_API_KEY=
CLICKSEND_FROM=
```

| 変数 | |
|---|---|
| `CLICKSEND_USERNAME` | ClickSend のユーザー名 |
| `CLICKSEND_API_KEY` | ダッシュボードの API キー |
| `CLICKSEND_FROM` | 任意の送信元。空にすると ClickSend の共有番号を使う |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=clicksend
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('clicksend')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- ClickSend は宛先ごとに結果を返します。一部が拒否された場合は、拒否された番号だけを正確に列挙した `DeliveryException` と、残りの宛先についての `partial` 結果を受け取れます。
