# Amazon SNS

<p class="lead">AWS アカウントから SNS で SMS を送信します。アプリケーションがすでに AWS 上で動いていて、請求を 1 か所にまとめたい場合に最適です。</p>

| | |
|---|---|
| ドライバーキー | `aws_sns` |
| 対応地域 | グローバル |
| 送信方式 | AWS SDK 経由で、宛先を 1 件ずつ送信します。 |
| テンプレート | 非対応（本文のみ） |
| 配信 Webhook | 非対応 |
| Web サイト | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## インストール {#install}

このドライバーには AWS SDK が必要です。

```bash
composer require aws/aws-sdk-php
```

## 設定 {#configure}

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SNS_SENDER_ID=
AWS_SNS_SMS_TYPE=
```

| 変数 | |
|---|---|
| `AWS_DEFAULT_REGION` | 送信に使うリージョン（例：`us-east-1`） |
| `AWS_ACCESS_KEY_ID` | 任意。省略するとデフォルトの認証情報チェーンを使う |
| `AWS_SECRET_ACCESS_KEY` | 任意。上のキーとセットで指定 |
| `AWS_SNS_SENDER_ID` | 任意。英数字の送信元 ID |
| `AWS_SNS_SMS_TYPE` | `Transactional`（デフォルト）または `Promotional` |

実際にメッセージを送って、設定を確認します。

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## 送信 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 知っておきたいこと {#good-to-know}

- EC2、ECS、Lambda、Vapor ではアクセスキーを空にしておけば、SDK がインスタンスロールやタスクロールを使います。これなら長期間有効なキーを `.env` に置かずに済みます。
- 新しい AWS アカウントは SMS サンドボックスの状態から始まり、認証済みの番号にしか送信できません。本番運用を始める前に、SNS コンソールから本番アクセスを申請してください。
- SNS は裏側で AWS End User Messaging を通じて SMS を送信しているため、利用上限、発信番号、送信元 ID はそちらのコンソールで管理します。
