# MSG91

<p class="lead">インドの大手ゲートウェイです。テンプレートメッセージには MSG91 の Flow を使い、DLT 登録まわりも Flow が引き受けてくれます。</p>

| | |
|---|---|
| ドライバーキー | `msg91` |
| 対応地域 | インド |
| 送信方式 | テンプレート：全宛先を 1 リクエストで送信。本文のみ：宛先ごとに 1 リクエストを並列で送信。 |
| テンプレート | 対応 |
| 配信 Webhook | 非対応 |
| Web サイト | [msg91.com](https://msg91.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=
MSG91_SENDER=
```

| 変数 | |
|---|---|
| `MSG91_AUTHKEY` | Auth Key |
| `MSG91_SENDER` | DLT 登録済みの 6 文字の送信元 ID |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +919812345678 --provider=msg91
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- インドの規制（DLT）により、商用メッセージはすべて登録済みのテンプレートに沿っている必要があります。MSG91 で Flow を作成し、`->template($flowId, ['otp' => 4821])` で送信してください。全宛先が 1 回のリクエストにまとめられ、どの宛先にも同じ変数が送られます。
- 本文のみのメッセージは MSG91 の v2 API を使い、宛先ごとに 1 リクエストで送信します。インドの番号に届くのは、本文が DLT テンプレートと完全に一致している場合だけです。
