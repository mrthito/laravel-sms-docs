# 직접 만드는 드라이버

<p class="lead">원하는 제공업체가 기본으로 들어 있지 않다면, 작은 클래스 하나로 드라이버를 만들 수 있습니다. 타임아웃, 동시 요청, 일부 실패, 안전한 오류 메시지는 기반 클래스가 처리하므로 제공업체의 API만 기술하면 됩니다.</p>

## 완성된 드라이버 예제 {#a-complete-driver}

요청 하나에 수신자 한 명을 받는 가상의 제공업체 Acme용 드라이버입니다.

```php
namespace App\Sms;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use MrRijal\LaravelSms\Drivers\HttpDriver;
use MrRijal\LaravelSms\SentMessage;
use MrRijal\LaravelSms\SmsMessage;
use MrRijal\LaravelSms\SmsResult;

class AcmeDriver extends HttpDriver
{
    protected string $label = 'Acme';

    protected function validateConfig(): void
    {
        $this->require('api_key', 'from');
    }

    public function send(SmsMessage $message): SmsResult
    {
        $text = $this->text($message);

        return $this->sendEach(
            $message,
            fn (PendingRequest $request, string $to) => $request
                ->withToken($this->value('api_key'))
                ->post('https://api.acme.test/v1/messages', [
                    'to' => $to,
                    'from' => $this->sender($message),
                    'text' => $text,
                ]),
            function (Response $response, string $to): SentMessage {
                if (! $response->successful()) {
                    $this->fail($response, 'error.message');
                }

                return new SentMessage($to, $this->jsonString($response, 'id'), 'accepted');
            },
        );
    }
}
```

`config/sms.php`에 등록합니다.

```php
'drivers' => [
    // …
    'acme' => App\Sms\AcmeDriver::class,
],

'providers' => [
    // …
    'acme' => [
        'api_key' => env('ACME_API_KEY'),
        'from' => env('ACME_FROM'),
    ],
],
```

이제 기본 제공업체와 똑같이 동작합니다. `Sms::provider('acme')`, 페일오버 체인, 큐, `php artisan sms:test --provider=acme` 모두 쓸 수 있습니다.

## 기반 클래스가 제공하는 것 {#what-the-base-class-gives-you}

| 메서드 | 용도 |
|---|---|
| `require('key', …)` | 설정이 빠졌을 때 "Acme configuration is incomplete"로 즉시 실패 |
| `value('key')` | 필수 설정을 앞뒤 공백을 제거한 문자열로 읽기 |
| `string('key', $default)` / `bool('key')` | 선택 설정 읽기 |
| `oneOf('key', [...], $default)` | 리전처럼 정해진 값만 허용 |
| `httpsUrl('key', $default)` | HTTPS를 쓰는 기본 URL만 허용 |
| `text($message)` | 본문을 가져오거나, 템플릿만 있는 메시지를 명확한 오류와 함께 거부 |
| `sender($message)` | 메시지의 `from()`, 없으면 설정된 발신자 |
| `sendEach(…)` | 수신자마다 요청 하나씩, 동시에 실행하며 일부 실패를 추적 |
| `sendOnce(…)` | 모든 수신자를 요청 하나로. 대량 발송 엔드포인트가 있는 제공업체용 |
| `fail($response, 'json.path')` | 제공업체가 밝힌 사유를 200자로 잘라 담은 `DeliveryException` 던지기 |
| `jsonString($response, 'path')` | 응답 본문에서 문자열(또는 정수) 읽기 |
| `cachedToken($clientId, fn () => …)` | OAuth 토큰을 받아 만료 직전까지 캐시 |

기반 클래스가 만드는 요청에는 이미 타임아웃, JSON `Accept` 헤더, `User-Agent`가 설정되어 있고, 다른 요청과 마찬가지로 `Http::fake()`에 잡힙니다.

## 대량 발송 엔드포인트 {#bulk-endpoints}

제공업체가 한 번의 호출로 여러 수신자를 받는다면 `sendOnce()`를 쓰고 결과는 직접 만드세요.

```php
return $this->sendOnce(
    $message,
    fn (PendingRequest $request) => $request
        ->withToken($this->value('api_key'))
        ->post('https://api.acme.test/v1/batches', [
            'to' => $message->getTo(),
            'text' => $this->text($message),
        ]),
    function (Response $response) use ($message): SmsResult {
        if ($response->status() !== 201) {
            $this->fail($response, 'error');
        }

        return SmsResult::accepted($message->getTo(), $this->jsonString($response, 'batch_id'));
    },
);
```

제공업체가 수신자별로 결과를 따로 알려 준다면, `failedRecipients`와 접수된 수신자를 담은 `partial` 결과로 `DeliveryException`을 던지세요. [ClickSend 드라이버](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/ClickSendDriver.php)가 참고하기 좋은 예입니다.

## 런타임에 등록하기 {#registering-at-runtime}

컨테이너에서 의존성을 주입받아야 하는 드라이버라면 `AppServiceProvider`에서 팩토리를 등록하세요.

```php
// app/Providers/AppServiceProvider.php
use MrRijal\LaravelSms\Facades\Sms;

public function boot(): void
{
    Sms::extend('acme', fn ($app, array $config) => new AcmeDriver($config));
}
```

`$config`는 `sms.providers`에 있는 해당 드라이버의 항목입니다. 이렇게 등록한 드라이버는 Octane, 큐 워커, `Sms::fake()`에서도 계속 동작합니다.

## 최소 요건 {#the-minimum}

`MrRijal\LaravelSms\Contracts\SmsProvider`를 구현한 클래스라면 무엇이든 드라이버가 될 수 있습니다. 필요한 메서드는 하나뿐입니다.

```php
public function send(SmsMessage $message): SmsResult;
```

접수된 수신자를 반환하고, 실패하면 `DeliveryException`을 던지세요. `HttpDriver`를 상속하는 것은 선택이지만, 까다로운 예외 상황을 많이 덜어 줍니다.

## 웹훅 받기 {#receiving-webhooks}

드라이버에서 전송 보고서를 받으려면 `MrRijal\LaravelSms\Contracts\HandlesWebhooks`를 구현하고, 서명 검증에는 `VerifiesWebhooks` 트레이트를 쓰세요. 그러면 `/laravel-sms/webhook/acme`로 들어오는 요청이 `handleWebhook()` 메서드로 전달됩니다. 기본 제공되는 [Termii 드라이버](https://github.com/mr-rijal/laravel-sms/blob/main/src/Drivers/TermiiDriver.php)에서 이 패턴을 확인할 수 있습니다.
