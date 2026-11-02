# Brevo

<p class="lead">旧 Sendinblue です。すでに Brevo でメールを送っていて、メールと SMS を 1 つのアカウントにまとめたい場合に向いています。</p>

| | |
|---|---|
| ドライバーキー | `brevo` |
| 対応地域 | グローバル |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 対応 |
| 配信 Webhook | 非対応 |
| Web サイト | [www.brevo.com](https://www.brevo.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=
BREVO_SMS_SENDER=
BREVO_SMS_TYPE=
```

| 変数 | |
|---|---|
| `BREVO_API_KEY` | API キー（v3） |
| `BREVO_SMS_SENDER` | 送信者名（11 文字まで）または番号 |
| `BREVO_SMS_TYPE` | `transactional`（デフォルト）または `marketing` |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=brevo
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('brevo')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- Brevo の SMS テンプレートに対応しています。`->template('12', ['code' => 4821])` のように、テンプレート ID とそのパラメーターを渡してください。
- マーケティングメッセージには配信停止の手段を含める必要があり、国によっては送信できない時間帯も定められています。コードやレシートには `transactional` を使ってください。
