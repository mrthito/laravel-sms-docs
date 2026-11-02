# 環境変数

<p class="lead">パッケージが <code>.env</code> から読み込む設定を、1 か所にまとめました。使うプロバイダーのブロックをコピーして値を埋め、<code>php artisan sms:test</code> で確認してください。</p>

## 全体の仕組み {#how-it-fits-together}

`config/sms.php` はすべての値を `env()` で読み込むので、パッケージの設定は `.env` だけで完結します。次のルールを押さえておけば迷うことはありません。

- **使うものだけを設定する。** プロバイダーの変数が読み込まれるのは、そのプロバイダーで送信するときだけです。使わないプロバイダーには何も設定しなくてかまいません。
- **スペースや `#` を含む値は引用符で囲む。** `TWILIO_FROM=ACME Alerts` ではなく `TWILIO_FROM="ACME Alerts"` と書きます。
- **本番環境ではキャッシュする。** サーバー上で `.env` を変更したら `php artisan config:cache` を実行してください。実行しないと古い値が使われ続けます。
- **シークレットを git に入れない。** コミットするのは値を空にした `.env.example` だけにして、本物の `.env` は決してコミットしないでください。Laravel Cloud、Forge、Vapor を使っている場合は、それぞれの環境設定で値を設定します。

## 全般の設定 {#general-settings}

すべてのプロバイダーに共通の設定です。どれも省略できます。

```ini [.env]
# デフォルトで送信に使うプロバイダー：プロバイダーキー、"failover" または "random"
SMS_PROVIDER=twilio

# フェイルオーバーのチェーン。左から順に試す（SMS_PROVIDER=failover のときに使用）
SMS_FAILOVER_DRIVERS=twilio,vonage

# send() をすぐに送信せず、すべてキューに入れる
SMS_QUEUE=false
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120          # キューの retry_after はこれより長くすること

# プロバイダーへの HTTP 呼び出し
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
SMS_HTTP_CONCURRENCY=10        # 宛先ごとに送るプロバイダーでの同時リクエスト数

# Log ドライバー（開発専用）
SMS_LOG_CHANNEL=
```

それぞれの詳しい意味は[設定](/ja/reference/configuration)を参照してください。

## グローバルなプロバイダー {#global-providers}

### Twilio {#twilio}

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=                    # Account SID（AC で始まる）
TWILIO_TOKEN=                  # Auth Token
TWILIO_FROM=                   # 送信元の番号または英数字 ID
TWILIO_MESSAGING_SERVICE_SID=  # 任意。単一の送信元の代わりに Messaging Service を使う（MG で始まる）
```

[Twilio のガイド →](/ja/providers/twilio)

### Vonage {#vonage}

```ini [.env]
SMS_PROVIDER=vonage

VONAGE_KEY=     # API キー
VONAGE_SECRET=  # API シークレット
VONAGE_FROM=    # 送信元の番号または英数字 ID
```

[Vonage のガイド →](/ja/providers/vonage)

### Sinch {#sinch}

```ini [.env]
SMS_PROVIDER=sinch

SINCH_SERVICE_PLAN_ID=  # SMS ダッシュボードのサービスプラン ID
SINCH_API_TOKEN=        # そのサービスプランの API トークン
SINCH_FROM=             # 送信元の番号または英数字 ID
SINCH_REGION=           # us（デフォルト）、eu、au、br、ca のいずれか。アカウントのリージョンと一致させること
```

[Sinch のガイド →](/ja/providers/sinch)

### Bird {#bird}

```ini [.env]
SMS_PROVIDER=bird

BIRD_API_KEY=   # ワークスペースの API キー（bk_ で始まる）
BIRD_FROM=      # 送信元の番号または英数字 ID
BIRD_REGION=    # us1（デフォルト）または eu1。キーと一致させること
BIRD_CATEGORY=  # transactional（デフォルト）、marketing、authentication、service のいずれか
```

[Bird のガイド →](/ja/providers/bird)

### Plivo {#plivo}

```ini [.env]
SMS_PROVIDER=plivo

PLIVO_AUTH_ID=       # Auth ID
PLIVO_AUTH_TOKEN=    # Auth Token
PLIVO_FROM=          # 送信元の番号または英数字 ID
PLIVO_LOG_MESSAGES=  # 任意、デフォルトは false。Plivo がメッセージ本文と番号をログに保存するかどうか
```

[Plivo のガイド →](/ja/providers/plivo)

### Telnyx {#telnyx}

```ini [.env]
SMS_PROVIDER=telnyx

TELNYX_API_KEY=               # API キー（v2）
TELNYX_FROM=                  # 送信元の番号
TELNYX_MESSAGING_PROFILE_ID=  # 任意。単一の送信元の代わりに、メッセージングプロファイルとその番号プールを使う
```

[Telnyx のガイド →](/ja/providers/telnyx)

### Infobip {#infobip}

```ini [.env]
SMS_PROVIDER=infobip

INFOBIP_API_KEY=   # API キー
INFOBIP_SENDER=    # 送信元の番号または英数字 ID
INFOBIP_BASE_URL=  # Infobip ポータルに表示される個別のベース URL（例：https://xyz123.api.infobip.com）
```

[Infobip のガイド →](/ja/providers/infobip)

### ClickSend {#clicksend}

```ini [.env]
SMS_PROVIDER=clicksend

CLICKSEND_USERNAME=  # ClickSend のユーザー名
CLICKSEND_API_KEY=   # ダッシュボードの API キー
CLICKSEND_FROM=      # 任意の送信元。空にすると ClickSend の共有番号を使う
```

[ClickSend のガイド →](/ja/providers/clicksend)

### Clickatell {#clickatell}

```ini [.env]
SMS_PROVIDER=clickatell

CLICKATELL_API_KEY=  # One API インテグレーションの API キー
CLICKATELL_FROM=     # 任意の送信元（アカウントで承認済みのものがある場合）
```

[Clickatell のガイド →](/ja/providers/clickatell)

### Brevo {#brevo}

```ini [.env]
SMS_PROVIDER=brevo

BREVO_API_KEY=     # API キー（v3）
BREVO_SMS_SENDER=  # 送信者名（11 文字まで）または番号
BREVO_SMS_TYPE=    # transactional（デフォルト）または marketing
```

[Brevo のガイド →](/ja/providers/brevo)

### Bandwidth {#bandwidth}

```ini [.env]
SMS_PROVIDER=bandwidth

BANDWIDTH_ACCOUNT_ID=      # アカウント ID
BANDWIDTH_APPLICATION_ID=  # 番号に紐付けたメッセージングアプリケーション
BANDWIDTH_CLIENT_ID=       # OAuth クライアント ID
BANDWIDTH_CLIENT_SECRET=   # OAuth クライアントシークレット
BANDWIDTH_FROM=            # そのアプリケーションに割り当てた Bandwidth の番号
```

[Bandwidth のガイド →](/ja/providers/bandwidth)

### SendPulse {#sendpulse}

```ini [.env]
SMS_PROVIDER=sendpulse

SENDPULSE_CLIENT_ID=      # REST API の ID
SENDPULSE_CLIENT_SECRET=  # REST API のシークレット
SENDPULSE_SENDER=         # 承認済みの送信者名（11 文字まで）
```

[SendPulse のガイド →](/ja/providers/sendpulse)

### Amazon SNS {#aws-sns}

先に AWS SDK をインストールしておく必要があります：`composer require aws/aws-sdk-php`。

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=     # 送信に使うリージョン（例：us-east-1）
AWS_ACCESS_KEY_ID=      # 任意。省略するとデフォルトの認証情報チェーンを使う
AWS_SECRET_ACCESS_KEY=  # 任意。上のキーとセットで指定
AWS_SNS_SENDER_ID=      # 任意。英数字の送信元 ID
AWS_SNS_SMS_TYPE=       # Transactional（デフォルト）または Promotional
```

[Amazon SNS のガイド →](/ja/providers/aws-sns)

### WhatsApp {#whatsapp}

```ini [.env]
SMS_PROVIDER=whatsapp

WHATSAPP_PHONE_NUMBER_ID=       # WhatsApp Manager の電話番号 ID
WHATSAPP_ACCESS_TOKEN=          # システムユーザーの永続アクセストークン
WHATSAPP_API_VERSION=           # 任意、デフォルトは v21.0
WHATSAPP_TEMPLATE_LANGUAGE=     # 任意、デフォルトは en。テンプレートの言語コード（例：en_US）
WHATSAPP_DEFAULT_COUNTRY_CODE=  # 任意。国番号なしで書かれた番号に付け加える
```

[WhatsApp のガイド →](/ja/providers/whatsapp)

## 地域のプロバイダー {#regional-providers}

### MSG91 {#msg91}

```ini [.env]
SMS_PROVIDER=msg91

MSG91_AUTHKEY=  # Auth Key
MSG91_SENDER=   # DLT 登録済みの 6 文字の送信元 ID
```

[MSG91 のガイド →](/ja/providers/msg91)

### Sparrow SMS {#sparrow}

```ini [.env]
SMS_PROVIDER=sparrow

SPARROW_TOKEN=  # API トークン
SPARROW_FROM=   # 承認済みの identity（送信元）
```

[Sparrow SMS のガイド →](/ja/providers/sparrow)

### Termii {#termii}

```ini [.env]
SMS_PROVIDER=termii

TERMII_API_KEY=    # API キー
TERMII_SENDER_ID=  # 承認済みの送信元 ID
TERMII_CHANNEL=    # generic（デフォルト）、DND 登録番号向けの dnd、または whatsapp
TERMII_BASE_URL=   # 任意。Termii ダッシュボードに表示されるアカウントのベース URL（HTTPS のみ）
```

[Termii のガイド →](/ja/providers/termii)

### Sendchamp {#sendchamp}

```ini [.env]
SMS_PROVIDER=sendchamp

SENDCHAMP_API_KEY=      # 公開アクセスキー
SENDCHAMP_SENDER_NAME=  # 承認済みの送信者名
SENDCHAMP_ROUTE=        # dnd（デフォルト）、non_dnd、international のいずれか
```

[Sendchamp のガイド →](/ja/providers/sendchamp)

### Africa's Talking {#africastalking}

```ini [.env]
SMS_PROVIDER=africastalking

AFRICASTALKING_API_KEY=   # API キー
AFRICASTALKING_USERNAME=  # アプリのユーザー名（テスト中は sandbox）
AFRICASTALKING_FROM=      # 任意。送信元 ID またはショートコード
AFRICASTALKING_SANDBOX=   # sandbox API を使う場合は true
```

[Africa's Talking のガイド →](/ja/providers/africastalking)

### BulkSMS {#bulksms}

```ini [.env]
SMS_PROVIDER=bulksms

BULKSMS_TOKEN_ID=      # API トークン ID
BULKSMS_TOKEN_SECRET=  # API トークンシークレット
BULKSMS_FROM=          # 任意の送信元（アカウントにある場合）
```

[BulkSMS のガイド →](/ja/providers/bulksms)

## Webhook のシークレット {#webhook-secrets}

配信レポートを受け取る場合にだけ必要です。それぞれ対応するプロバイダーには必須で、設定がなければそのプロバイダーの Webhook は拒否されます。詳しくは [Webhook](/ja/guide/webhooks) を参照してください。

```ini [.env]
SMS_WEBHOOKS_ENABLED=true
SMS_WEBHOOKS_PREFIX=laravel-sms/webhook

WHATSAPP_VERIFY_TOKEN=          # 任意のランダムな文字列。Meta のダッシュボードにも入力する
WHATSAPP_WEBHOOK_SECRET=        # Meta のアプリシークレット
TERMII_WEBHOOK_SECRET=
SENDCHAMP_WEBHOOK_SECRET=
BULKSMS_WEBHOOK_SECRET=
AFRICASTALKING_WEBHOOK_SECRET=  # コールバック URL にも ?token= として付ける
```

自分で決めるシークレットは `php -r "echo bin2hex(random_bytes(24));"` で生成できます。

## 設定例 {#a-complete-example}

本番環境を想定した構成です。Twilio を優先し、Vonage をバックアップに置き、すべてキューで送信し、WhatsApp の配信レポートも受け取ります。

```ini [.env]
SMS_PROVIDER=failover
SMS_FAILOVER_DRIVERS=twilio,vonage

SMS_QUEUE=true
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

VONAGE_KEY=
VONAGE_SECRET=
VONAGE_FROM=ACME

SMS_WEBHOOKS_ENABLED=true
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_WEBHOOK_SECRET=
```

最後に、チェーン内の各プロバイダーを確認します。

```bash
php artisan sms:test +15551234567 --provider=twilio
php artisan sms:test +15551234567 --provider=vonage
```
