# Bandwidth

<p class="lead">自社でネットワークを保有する米国のキャリアで、大手のコミュニケーションプラットフォームの多くが利用しています。認証には OAuth 2.0 を使います。</p>

| | |
|---|---|
| ドライバーキー | `bandwidth` |
| 対応地域 | 米国・カナダ |
| 送信方式 | 宛先ごとに 1 リクエスト。[並列で](/ja/guide/performance)送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [www.bandwidth.com](https://www.bandwidth.com) |

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=
BANDWIDTH_APPLICATION_ID=
BANDWIDTH_CLIENT_ID=
BANDWIDTH_CLIENT_SECRET=
BANDWIDTH_FROM=
```

| 変数 | |
|---|---|
| `BANDWIDTH_ACCOUNT_ID` | アカウント ID |
| `BANDWIDTH_APPLICATION_ID` | 番号に紐付けたメッセージングアプリケーション |
| `BANDWIDTH_CLIENT_ID` | OAuth クライアント ID |
| `BANDWIDTH_CLIENT_SECRET` | OAuth クライアントシークレット |
| `BANDWIDTH_FROM` | そのアプリケーションに割り当てた Bandwidth の番号 |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=bandwidth
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('bandwidth')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- ドライバーはクライアント ID とシークレットをアクセストークンに交換し、約 1 時間キャッシュします。期限前にトークンが拒否された場合は破棄し、次の送信で新しいトークンを取得します。
- 宛先を 1 件ずつ送るのは意図的です。Bandwidth は 1 回のリクエストに含まれる複数の番号をグループ会話として扱い、全員がお互いの返信を見られる状態になってしまうためです。
