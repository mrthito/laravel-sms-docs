# Log

<p class="lead">デフォルトのドライバーです。メッセージを送信する代わりにすべて Laravel のログに書き出すので、プロバイダーのアカウントや本物の電話がなくても、SMS の機能を作って画面で動かしてみることができます。</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # 任意：config/logging.php に定義した専用チャネル
```

メッセージは 1 件ごとに `debug` のログエントリになります。

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

宛先はマスクされますが、開発中にコードを読めるよう、メッセージ本文はそのまま記録されます。だからこそ、log ドライバーは**本番環境では決して使わないでください**。ログインコードがログファイルに残ってしまいます。

`sendNow()` は `log-…` 形式で生成したメッセージ ID を持つ `SmsResult` を返すので、ID を保存するコードもそのまま動きます。
