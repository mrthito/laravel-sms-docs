# Telnyx

<p class="lead">自社のプライベートネットワークを運用する、開発者向けのキャリアです。米国での料金に競争力があります。</p>

| | |
|---|---|
| ドライバーキー | `telnyx` |
| 対応地域 | グローバル |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [telnyx.com](https://telnyx.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=
TELNYX_FROM=
TELNYX_MESSAGING_PROFILE_ID=
```

| 変数 | |
|---|---|
| `TELNYX_API_KEY` | API キー（v2） |
| `TELNYX_FROM` | 送信元の番号 |
| `TELNYX_MESSAGING_PROFILE_ID` | 任意。単一の送信元の代わりに、メッセージングプロファイルとその番号プールを使う |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=telnyx
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('telnyx')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- `TELNYX_FROM` か `TELNYX_MESSAGING_PROFILE_ID` のどちらかが必要です。
- 米国の番号は、10DLC の登録を済ませないと、Telnyx がアプリケーションから人への（A2P）トラフィックを配信してくれません。
