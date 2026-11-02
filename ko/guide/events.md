# 이벤트

<p class="lead">네 가지 이벤트가 메시지의 처음부터 끝까지를 다룹니다. 감사 로그, 분석, 수신 거부 목록 관리에 활용하거나, 마지막 순간에 메시지를 막을 때 쓰세요.</p>

| 이벤트 | 발생 시점 | 속성 |
|---|---|---|
| `SmsSending` | 제공업체를 호출하기 전 | `message`, `provider` |
| `SmsSent` | 제공업체가 메시지를 접수한 후 | `message`, `provider`, `result` |
| `SmsFailed` | 발송이 실패한 후 (예외는 그대로 던져집니다) | `message`, `provider`, `exception` |
| `SmsWebhookReceived` | 검증된 제공업체 웹훅이 도착한 후 | `provider`, `payload`, `messageId`, `status`, `recipient` |

네 이벤트 모두 `MrRijal\LaravelSms\Events` 네임스페이스에 있습니다. `provider`는 메시지를 보낸 제공업체 이름입니다. `random`을 쓰면 실제로 선택된 제공업체(예: `twilio`)가, `failover`를 쓰면 `failover`가 들어갑니다.

## 리스너 작성하기 {#writing-a-listener}

Laravel 11부터는 리스너가 스스로 등록됩니다. 리스너를 생성하고 `handle()`에 이벤트 타입을 지정하면 Laravel이 알아서 연결합니다. 서비스 프로바이더도, `$listen` 배열도 필요 없습니다.

```bash
php artisan make:listener RecordSentSms --event="MrRijal\LaravelSms\Events\SmsSent"
```

```php
namespace App\Listeners;

use App\Models\SmsLog;
use MrRijal\LaravelSms\Events\SmsSent;

class RecordSentSms
{
    public function handle(SmsSent $event): void
    {
        foreach ($event->result->messages as $sent) {
            SmsLog::create([
                'provider' => $event->provider,
                'to' => $sent->to,
                'provider_id' => $sent->id,
                'status' => $sent->status,
            ]);
        }
    }
}
```

Laravel은 `app/Listeners`를 스캔해 `handle(SmsSent $event)`를 찾고, 이 리스너를 해당 이벤트에 등록합니다. 무엇이 등록됐는지는 다음 명령어로 확인할 수 있습니다.

```bash
php artisan event:list --event=SmsSent
```

프로덕션에서는 `php artisan optimize`가 설정, 라우트와 함께 발견된 리스너 목록도 캐시합니다.

::: tip 리스너 때문에 중복 발송되지 않습니다
`SmsSent`가 발생한 시점에는 이미 제공업체가 메시지를 받은 상태입니다. 리스너 중 하나가 예외를 던지면 그 예외는 에러 핸들러로 가고, 발송은 그대로 성공으로 처리됩니다. 덕분에 감사 로그 기록이 실패했다고 큐 작업이 같은 문자를 다시 보내는 일은 없습니다.
:::

### 리스너 하나로 여러 이벤트 처리 {#one-listener-several-events}

유니온 타입도 쓸 수 있습니다. 다음 리스너는 성공과 실패를 모두 처리합니다.

```php
use MrRijal\LaravelSms\Events\SmsFailed;
use MrRijal\LaravelSms\Events\SmsSent;

public function handle(SmsSent|SmsFailed $event): void
{
    $succeeded = $event instanceof SmsSent;

    // …
}
```

### 큐 리스너 {#queued-listeners}

데이터베이스에 기록하거나 분석 API를 호출하느라 발송이 느려져서는 안 됩니다. `ShouldQueue`를 구현하면 리스너가 큐에서 실행됩니다.

```php
use Illuminate\Contracts\Queue\ShouldQueue;

class RecordSentSms implements ShouldQueue
{
    public function handle(SmsSent $event): void
    {
        // …
    }
}
```

Laravel 13에서는 어트리뷰트로 큐를 지정할 수 있습니다.

```php
use Illuminate\Queue\Attributes\Queue;

#[Queue('sms-audit')]
class RecordSentSms implements ShouldQueue
{
    // …
}
```

## 발송 취소 {#cancelling-a-send}

`SmsSending` 리스너에서 `false`를 반환하면 메시지는 발송되지 않습니다. 이때 `sendNow()`는 `null`을 반환합니다.

```php
namespace App\Listeners;

use App\Models\OptOut;
use MrRijal\LaravelSms\Events\SmsSending;

class RespectOptOuts
{
    public function handle(SmsSending $event): ?bool
    {
        // STOP으로 답장한 사람에게는 다시 보내지 않습니다.
        $optedOut = OptOut::whereIn('phone', $event->message->getTo())->exists();

        return $optedOut ? false : null;
    }
}
```

메시지를 그대로 보내려면 `null`을 반환하거나 아무것도 반환하지 마세요. 명시적으로 `false`를 반환했을 때만 취소됩니다.

::: warning 이 리스너는 동기로 두세요
발송을 취소하는 리스너는 `ShouldQueue`를 구현하면 안 됩니다. 큐 리스너는 메시지가 이미 나간 뒤에 실행되므로 취소할 것이 남아 있지 않습니다.
:::

리스너는 `getTo()`, `getText()`, `getTemplateId()`, `getVariables()`, `getFrom()`, `getProvider()`로 메시지 전체를 확인할 수 있습니다.

## 실패에 대응하기 {#reacting-to-failures}

```php
namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use MrRijal\LaravelSms\Events\SmsFailed;

class AlertOnSmsFailure
{
    public function handle(SmsFailed $event): void
    {
        Log::warning('SMS failed', [
            'provider' => $event->provider,
            'recipients' => $event->message->getRedactedRecipientsForLogging(),
            'error' => $event->exception->getMessage(),
        ]);
    }
}
```

`getRedactedRecipientsForLogging()`은 마지막 네 자리만 남기고 가립니다(`***4567`). 그래서 로그에 전화번호가 잔뜩 쌓이지 않습니다.

패키지는 발송이 실패할 때마다 이미 `error` 로그를 한 줄씩 남깁니다. 성공한 발송은 로그에 남기지 않으니, 필요하다면 `SmsSent` 리스너를 추가하세요.

## 클로저 리스너 {#closure-listeners}

간단히 한 번 쓰고 말 용도라면 `AppServiceProvider::boot()`에 클로저를 등록해도 됩니다.

```php
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

public function boot(): void
{
    Event::listen(function (SmsSent $event) {
        // …
    });
}
```

리스너 클래스가 테스트하기도, 큐로 돌리기도 더 쉬우니 계속 유지할 코드라면 클래스를 쓰세요.

## 리스너 테스트하기 {#testing-your-listeners}

```php
use App\Listeners\RecordSentSms;
use Illuminate\Support\Facades\Event;
use MrRijal\LaravelSms\Events\SmsSent;

it('records sent messages', function () {
    Event::assertListening(SmsSent::class, RecordSentSms::class);
});
```

`Sms::fake()`도 실제 발송과 똑같이 `SmsSending`과 `SmsSent`를 발생시키므로, 리스너를 처음부터 끝까지 통합 테스트할 수도 있습니다. [테스트](/ko/guide/testing)를 참고하세요.
