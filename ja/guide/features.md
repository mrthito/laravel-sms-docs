# 機能一覧

<p class="lead">パッケージでできることを 1 ページにまとめました。各項目から、詳しく説明しているガイドのページに移動できます。</p>

## 送信 {#sending}

| | |
|---|---|
| **20 社のプロバイダーをひとつの API で** | Twilio、Vonage、Sinch、Bird、Plivo、Telnyx、Infobip、ClickSend、Clickatell、Brevo、Bandwidth、SendPulse、Amazon SNS、WhatsApp、MSG91、Sparrow SMS、Termii、Sendchamp、Africa's Talking、BulkSMS。[プロバイダー →](/ja/providers/) |
| **流れるように書けるビルダー** | `Sms::to()->message()->send()`。呼び出すたびに新しいメッセージが作られます。[メッセージを組み立てる →](/ja/guide/sending) |
| **番号の整形** | スペース、ハイフン、ドット、括弧を取り除き、重複を除外し、無効な番号は送信前に拒否します。[宛先 →](/ja/guide/sending#recipients) |
| **送信元の上書き** | メッセージごとに `->from('ACME')`。[送信元 →](/ja/guide/sending#sender) |
| **テンプレート** | MSG91 Flow（DLT）、WhatsApp テンプレート、Brevo テンプレートに対応。ほかのプロバイダー向けには本文へのフォールバックも可能です。[テンプレート →](/ja/guide/templates) |
| **マクロ** | よく送るメッセージに名前を付けられます：`Sms::sendOtp($phone, $code)`。[マクロ →](/ja/guide/sending#macros) |

## 信頼性 {#reliability}

| | |
|---|---|
| **メッセージ ID 付きの送信結果** | 送信のたびに、受け付けられた宛先ごとのプロバイダーの ID が返ります。[送信結果 →](/ja/guide/results) |
| **正確な失敗情報** | `DeliveryException` には、失敗した宛先と届いた宛先の両方が入っています。[一部だけ失敗したとき →](/ja/guide/results#partial-failures) |
| **フェイルオーバー** | プロバイダーをチェーンでつなぎ、拒否された宛先だけを次に回すので、同じ相手に 2 通届くことはありません。[フェイルオーバー →](/ja/guide/failover) |
| **負荷分散** | 複数のプロバイダーのプールにメッセージを分散します。[負荷分散 →](/ja/guide/failover#load-balancing) |
| **キュー** | `sendLater()`、`sendLaterAt()`。宛先ごとに暗号化されたジョブを 1 つずつ作り、リトライも行います。[キューで送る →](/ja/guide/queueing) |

## 速度 {#speed}

| | |
|---|---|
| **一括リクエスト** | 一括送信エンドポイントを持つプロバイダーには、全宛先を 1 回の呼び出しで送ります。[パフォーマンス →](/ja/guide/performance) |
| **並列リクエスト** | それ以外のプロバイダーには並列で送信します。デフォルトは 10 件ずつ同時です。[パフォーマンス →](/ja/guide/performance#per-recipient-providers-in-parallel) |
| **トークンのキャッシュ** | OAuth トークンは期限が切れるまで使い回します。[トークンのキャッシュ →](/ja/guide/performance#token-caching) |

## Laravel との統合 {#laravel-integration}

| | |
|---|---|
| **通知チャネル** | `via()` で `'sms'` を返し、`toSms()` でメッセージを返すだけ。[通知 →](/ja/guide/notifications) |
| **イベント** | `SmsSending`（キャンセル可能）、`SmsSent`、`SmsFailed`、`SmsWebhookReceived`。リスナークラスは Laravel が自動で見つけてくれます。[イベント →](/ja/guide/events) |
| **Webhook** | WhatsApp、Termii、Sendchamp、Africa's Talking、BulkSMS の署名付き配信レポート。[Webhook →](/ja/guide/webhooks) |
| **Artisan** | `php artisan sms:test` と、`php artisan about` 内のセクション。[Artisan →](/ja/reference/artisan) |
| **Octane やキューでも安全** | 送信やリクエストの間で状態を共有しません。 |

## テスト {#testing}

| | |
|---|---|
| **`Sms::fake()`** | 送信する代わりにメッセージを記録し、読みやすいアサーションで検証できます。[テスト →](/ja/guide/testing) |
| **`Http::fake()`** | HTTP を使うドライバーはすべて Laravel の HTTP クライアントで動きます。[ドライバーをテストする →](/ja/guide/testing#testing-a-driver) |

## セキュリティ {#security}

| | |
|---|---|
| **安全側に倒れる Webhook** | 署名のないリクエストや検証できないリクエストは拒否します。[Webhook →](/ja/guide/webhooks) |
| **キューのペイロードを暗号化** | コードや番号は `APP_KEY` で暗号化されます。[キューで送る →](/ja/guide/queueing#encrypted-at-rest) |
| **認証情報の衛生管理** | 例外メッセージ、URL、キャッシュキーにシークレットを含めません。ログの番号はマスクされます。[セキュリティ →](/ja/guide/security) |

## 拡張 {#extending}

| | |
|---|---|
| **カスタムドライバー** | `HttpDriver` を継承し、プロバイダーの API の部分だけを書けば済みます。[カスタムドライバー →](/ja/guide/custom-drivers) |
| **実行時の登録** | サービスプロバイダーから `Sms::extend('acme', …)`。[実行時に登録する →](/ja/guide/custom-drivers#registering-at-runtime) |
