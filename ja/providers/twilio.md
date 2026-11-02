# Twilio

<p class="lead">もっとも広く使われている SMS API です。北米とヨーロッパでの到達率が非常に高く、送信元のプールやコンプライアンス対応には Messaging Service を使えます。</p>

| | |
|---|---|
| ドライバーキー | `twilio` |
| 対応地域 | グローバル |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.twilio.com](https://www.twilio.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
TWILIO_MESSAGING_SERVICE_SID=
```

| 変数 | |
|---|---|
| `TWILIO_SID` | Account SID（`AC` で始まる） |
| `TWILIO_TOKEN` | Auth Token |
| `TWILIO_FROM` | 送信元の番号または英数字 ID |
| `TWILIO_MESSAGING_SERVICE_SID` | 任意。単一の送信元の代わりに Messaging Service を使う（`MG` で始まる） |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=twilio
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('twilio')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- `TWILIO_FROM` か `TWILIO_MESSAGING_SERVICE_SID` のどちらかが必要です。Messaging Service を使うと、Twilio がプールの中から最適な番号を選び、配信停止の処理も代わりに行ってくれます。
- メッセージで `from()` を指定した場合は、その送信元が使われ、そのメッセージでは Messaging Service は使われません。
- トライアルアカウントでは、Twilio コンソールで認証済みの番号にしか送信できません。
