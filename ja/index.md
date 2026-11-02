---
layout: home

hero:
  name: Laravel SMS
  text: SMS 送信を、Laravel らしく。
  tagline: 今日は Twilio、明日は Sinch。プロバイダーを替えてもコードはそのままです。20 社のプロバイダーに、ひとつの流れるような API と、次の手を打てる送信結果を。
  image:
    src: /logo.svg
    alt: Laravel SMS
  actions:
    - theme: brand
      text: はじめる
      link: /ja/guide/introduction
    - theme: alt
      text: プロバイダー一覧
      link: /ja/providers/
    - theme: alt
      text: GitHub
      link: https://github.com/mr-rijal/laravel-sms

features:
  - title: プロバイダーは .env で切り替え
    details: コードが話す相手はひとつの API だけ。SMS_PROVIDER を変えれば、次のメッセージから別の回線で送られます。
  - title: 何が起きたかがわかる
    details: 送信のたびにプロバイダーのメッセージ ID が返ります。失敗したときは、どの番号が拒否され、どの番号に届いたのかが正確にわかります。
  - title: 二重送信しないフェイルオーバー
    details: Twilio が 100 件中 98 件を受け付けたら、Vonage に回るのは残りの 2 件だけ。同じ相手に 2 通届くことはありません。
  - title: 大量送信も速い
    details: 一括送信に対応したプロバイダーにはリクエスト 1 回で。それ以外は並列に送信し、デフォルトでは 10 件ずつ同時に処理します。
  - title: 最初から安全
    details: 署名のない Webhook はすべて拒否します。キューに入れたメッセージは暗号化されます。認証情報が例外メッセージやキャッシュキーに含まれることはありません。
  - title: テストが書きやすい
    details: Sms::fake() を使えば実際には送信せずに記録だけします。アサーションは文章のように読めます。どのドライバーも Http::fake() で動きます。
---

<div class="home-section">

## 書くのは一度だけ {#write-it-once}

<p>API は小さく保っています。誰に送るのか、何を送るのか、そしてプロバイダーの応答をどこで受け取るのか。それだけです。</p>

<div class="home-code">
<div>
<div class="caption">すぐに送る</div>

```php
use MrRijal\LaravelSms\Facades\Sms;

$result = Sms::to('+15551234567')
    ->message('Your code is 4821')
    ->sendNow();

$result?->firstId(); // "SM9f1c…"
```

</div>
<div>
<div class="caption">キューに入れる</div>

```php
Sms::provider('sinch')
    ->to($customers->pluck('phone'))
    ->from('ACME')
    ->message('We open at 9am tomorrow.')
    ->sendLater();
```

</div>
<div>
<div class="caption">通知から送る</div>

```php
public function toSms($user): SmsMessage
{
    $id = $this->order->id;

    return SmsMessage::create("Order #{$id} shipped.");
}
```

</div>
<div>
<div class="caption">テストで使う</div>

```php
Sms::fake();

$this->post('/login', $credentials);

Sms::assertSentTo('+15551234567');
```

</div>
</div>

</div>

<div class="home-section">

## 20 社のプロバイダーにすぐ対応 {#twenty-providers-ready-to-go}

<p>グローバルなプラットフォームに加え、それらが届かない地域をカバーする現地の回線、そして開発やテストのためのドライバーもいくつか用意しています。</p>

<div class="provider-cloud">
  <a href="/ja/providers/twilio">Twilio</a>
  <a href="/ja/providers/vonage">Vonage</a>
  <a href="/ja/providers/sinch">Sinch</a>
  <a href="/ja/providers/bird">Bird</a>
  <a href="/ja/providers/plivo">Plivo</a>
  <a href="/ja/providers/telnyx">Telnyx</a>
  <a href="/ja/providers/infobip">Infobip</a>
  <a href="/ja/providers/clicksend">ClickSend</a>
  <a href="/ja/providers/clickatell">Clickatell</a>
  <a href="/ja/providers/brevo">Brevo</a>
  <a href="/ja/providers/bandwidth">Bandwidth</a>
  <a href="/ja/providers/sendpulse">SendPulse</a>
  <a href="/ja/providers/aws-sns">Amazon SNS</a>
  <a href="/ja/providers/whatsapp">WhatsApp</a>
  <a href="/ja/providers/msg91">MSG91</a>
  <a href="/ja/providers/sparrow">Sparrow SMS</a>
  <a href="/ja/providers/termii">Termii</a>
  <a href="/ja/providers/sendchamp">Sendchamp</a>
  <a href="/ja/providers/africastalking">Africa's Talking</a>
  <a href="/ja/providers/bulksms">BulkSMS</a>
</div>

</div>

<div class="home-section home-closing">

## 2 分で動かせます {#up-and-running-in-two-minutes}

<p>パッケージをインストールして認証情報を設定すれば、コードを 1 行も書かないうちにターミナルから本物のメッセージを送れます。</p>

```bash
composer require mr-rijal/laravel-sms
php artisan sms:test +15551234567
```

</div>
