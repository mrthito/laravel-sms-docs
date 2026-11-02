# インストール

<p class="lead">Composer のコマンドを 1 つ実行して、<code>.env</code> に数行書き足すだけです。サービスプロバイダーと <code>Sms</code> ファサードは自動で登録されます。</p>

## パッケージをインストールする {#install-the-package}

```bash
composer require mr-rijal/laravel-sms
```

続いて設定ファイルを公開します。2 社目のプロバイダーを追加したり、デフォルト値を変えたりするときに必要になります。

```bash
php artisan vendor:publish --tag=sms-config
```

これで `config/sms.php` が作成されます。中身はすべて環境変数から読み込むようになっているので、ほとんどのプロジェクトではこのファイル自体を編集する必要はありません。

## プロバイダーを選ぶ {#choose-a-provider}

デフォルトのプロバイダーと、その認証情報を設定します。Twilio の場合は次のとおりです。

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

必要な変数は各プロバイダーのページにすべて載っています。まだプロバイダーを決めていなければ、[プロバイダーの一覧](/ja/providers/)から見てみてください。

::: tip ローカルで開発するときは
`SMS_PROVIDER` は設定しないでおきましょう。デフォルトは `log` ドライバーで、メッセージを送信する代わりに Laravel のログに書き出します。うっかり本物の電話に届いてしまう心配はありません。
:::

## 動作を確認する {#check-that-it-works}

ターミナルから実際にメッセージを送ってみます。アプリケーションとまったく同じコードを通って送信されます。

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

うまくいかなかった場合は、プロバイダーが返した内容がそのまま表示されます。たとえば `Failed to send SMS via Twilio (HTTP 401): Authenticate` のような形です。`--provider=sinch` で特定のプロバイダーを、`--message="Hello"` で任意の本文を指定して試すこともできます。

また、`php artisan about` に **Laravel SMS** のセクションが追加され、デフォルトのプロバイダーと、キューや Webhook が有効かどうかを確認できます。

## 必要に応じて：Amazon SNS {#optional-amazon-sns}

AWS SDK はサイズが大きいため、必要な場合にしかインストールされません。[Amazon SNS](/ja/providers/aws-sns) ドライバーを使う場合は、次を実行してください。

```bash
composer require aws/aws-sdk-php
```

## 次のステップ {#next-steps}

[最初の SMS を送る →](/ja/guide/quick-start)
