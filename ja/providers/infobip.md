# Infobip

<p class="lead">通信事業者とのつながりが非常に広いエンタープライズ向けプラットフォームで、特にヨーロッパ、中東、アフリカに強みがあります。SMS API v3 を使います。</p>

| | |
|---|---|
| ドライバーキー | `infobip` |
| 対応地域 | グローバル |
| 送信方式 | 全宛先を 1 リクエストで送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.infobip.com](https://www.infobip.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=
INFOBIP_SENDER=
INFOBIP_BASE_URL=
```

| 変数 | |
|---|---|
| `INFOBIP_API_KEY` | API キー |
| `INFOBIP_SENDER` | 送信元の番号または英数字 ID |
| `INFOBIP_BASE_URL` | Infobip ポータルに表示される個別のベース URL（例：`https://xyz123.api.infobip.com`） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=infobip
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('infobip')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- Infobip アカウントのホーム画面に表示される**個別のベース URL** を使ってください。Infobip はこの URL を通してトラフィックをルーティングしており、サポートに問い合わせる際にも尋ねられます。
- ベース URL は HTTPS でなければなりません。それ以外の場合は、ドライバーの読み込み時に拒否されます。
