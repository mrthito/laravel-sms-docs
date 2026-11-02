# API

<p class="lead">日々の開発で使う公開クラスとメソッドを 1 ページにまとめました。</p>

## Sms ファサード {#sms-facade}

`MrRijal\LaravelSms\Facades\Sms` は `SmsManager` への呼び出しを中継します。

| メソッド | 戻り値 | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | 指定した番号宛てのメッセージを開始する |
| `provider(string $name)` | `PendingSms` | 特定のプロバイダーで送るメッセージを開始する |
| `message(string $text)` | `PendingSms` | この本文でメッセージを開始する |
| `template(string $id, array $vars = [])` | `PendingSms` | テンプレートメッセージを開始する |
| `compose(?SmsMessage $message = null)` | `PendingSms` | 既存のメッセージをビルダーで包む |
| `send(SmsMessage $message)` | `?SmsResult` | 送信する。`sms.queue` が有効ならキューに入れる |
| `sendNow(SmsMessage $message)` | `?SmsResult` | すぐに送信する |
| `queue(SmsMessage $message, $delay = null)` | `void` | 宛先ごとに 1 ジョブをキューに入れる |
| `driver(?string $name = null)` | `SmsProvider` | プロバイダーのドライバーインスタンス |
| `extend(string $name, Closure $factory)` | `SmsManager` | カスタムドライバーを登録する |
| `getDefaultDriver()` | `string` | デフォルトのプロバイダーキー |
| `forgetDrivers()` | `SmsManager` | キャッシュされたドライバーインスタンスを破棄する |
| `macro(string $name, callable $macro)` | `void` | 独自のメソッドを追加する |
| `fake()` | `SmsFake` | マネージャーを記録用のフェイクに置き換える |

## PendingSms {#pendingsms}

ファサードから返されます。4 つの送信メソッド以外は、すべてビルダー自身を返します。

| メソッド | |
|---|---|
| `to(string\|iterable $numbers)` | 宛先を追加する |
| `message(string $text)` / `content(string $text)` | 本文を設定する |
| `template(string $id, array $vars = [])` | プロバイダーのテンプレートを使う |
| `from(?string $sender)` | 送信元を上書きする |
| `provider(string $name)` | プロバイダーを選ぶ |
| `when($condition, $callback)` / `unless(…)` | 条件に応じて変更を加える |
| `getMessage()` | 内部の `SmsMessage` |
| `send()` → `?SmsResult` | 送信する。`sms.queue` が有効ならキューに入れる |
| `sendNow()` → `?SmsResult` | すぐに送信する |
| `sendLater()` | キューに入れる |
| `sendLaterAt($when)` / `later($when)` | 遅延を付けてキューに入れる。日時、時間間隔、秒数のいずれかを指定 |

## SmsMessage {#smsmessage}

`MrRijal\LaravelSms\SmsMessage` は 1 件のメッセージを表します。セッターはメッセージ自身を返すので、チェーンでつなげられます。

| メソッド | |
|---|---|
| `SmsMessage::create(?string $text = null)` | 新しいメッセージを作る。本文の指定は任意 |
| `to()`, `message()`, `content()`, `template()`, `from()`, `provider()` | `PendingSms` と同じ |
| `getTo()` → `list<string>` | 正規化された宛先 |
| `getText()`, `getTemplateId()`, `getFrom()`, `getProvider()` → `?string` | |
| `getVariables()` → `array` | テンプレート変数 |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | 別の番号を宛先にしたコピー |
| `getRedactedRecipientsForLogging()` → `list<string>` | `***4567` の形にマスクした番号 |
| `validate()` | 送信できない場合は `InvalidMessageException` をスローする |

## SmsResult {#smsresult}

| メンバー | |
|---|---|
| `$provider` | メッセージの送信に使われたプロバイダーキー |
| `$messages` | `list<SentMessage>`。受け付けられた宛先ごとに 1 件 |
| `recipients()` → `list<string>` | 受け付けられた番号 |
| `ids()` → `list<string>` | 重複を除いたプロバイダーのメッセージ ID |
| `firstId()` → `?string` | 最初のメッセージ ID |
| `count()` | 受け付けられた宛先の数 |

`SentMessage` には、読み取り専用のプロパティが 3 つあります：`$to`、`$id`、`$status`。

## 例外 {#exceptions}

すべて `MrRijal\LaravelSms\Exceptions` にあり、いずれも `SmsException` を実装しています。

| クラス | メンバー・内容 |
|---|---|
| `DeliveryException` | `$provider`、`$failedRecipients`、`$partial`（`?SmsResult`）、`hasPartialDelivery()`、`getCode()`（HTTP ステータス） |
| `InvalidMessageException` | 番号の形式が不正、本文が空または長すぎる、対応していないメッセージの種類 |
| `InvalidConfigurationException` | 不明なプロバイダー、設定の不足または不正 |

## コントラクト {#contracts}

| インターフェース | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult`。ドライバーを書くときに実装する |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response`。プロバイダーの Webhook を受け取る |
| `Contracts\Factory` | マネージャーにバインドされている。依存注入のタイプヒントに使う |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
