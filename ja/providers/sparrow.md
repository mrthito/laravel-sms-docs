# Sparrow SMS

<p class="lead">ネパールでもっとも広く使われている SMS ゲートウェイで、NTC と Ncell の両方に直接つながっています。</p>

| | |
|---|---|
| ドライバーキー | `sparrow` |
| 対応地域 | ネパール |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [sparrowsms.com](https://sparrowsms.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=
SPARROW_FROM=
```

| 変数 | |
|---|---|
| `SPARROW_TOKEN` | API トークン |
| `SPARROW_FROM` | 承認済みの identity（送信元） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +9779812345678 --provider=sparrow
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('sparrow')
    ->to('+9779812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- すべての宛先を 1 回のリクエストで送信します。
- ネパールの番号は、国番号付き（`+97798…`）でも、10 桁の国内携帯番号（`98…`）でも書けます。どちらも受け付けます。
