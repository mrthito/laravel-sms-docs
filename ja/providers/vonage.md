# Vonage

<p class="lead">旧 Nexmo です。国際的なカバー範囲が広く、料金体系もシンプルです。Vonage SMS API を使います。</p>

| | |
|---|---|
| ドライバーキー | `vonage` |
| 対応地域 | グローバル |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.vonage.com](https://www.vonage.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=
```

| 変数 | |
|---|---|
| `VONAGE_KEY` | API キー |
| `VONAGE_SECRET` | API シークレット |
| `VONAGE_FROM` | 送信元の番号または英数字 ID |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=vonage
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- 絵文字やデーヴァナーガリー文字など、GSM 文字セットにない文字を含むメッセージは自動的に Unicode で送信されるので、文字化けせずに届きます。
- Vonage はメッセージを拒否した場合でも HTTP 200 を返します。ドライバーはメッセージごとのステータスを読み取るので、拒否された場合はきちんと Vonage の理由付きで `DeliveryException` がスローされます。
