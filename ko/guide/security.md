# 보안

<p class="lead">SMS에는 로그인 코드, 주문 정보, 개인 전화번호가 담깁니다. 이를 보호하는 기본 동작과, 직접 챙겨야 할 몇 가지 설정을 정리했습니다.</p>

## 패키지가 대신 해 주는 것 {#what-the-package-does-for-you}

**인증 정보는 둔 곳에만 머뭅니다.** API 키와 토큰은 설정에서 읽어 해당 제공업체에만 보냅니다. 예외 메시지나 URL 쿼리 문자열에는 절대 포함되지 않으며, OAuth 토큰은 해시된 키로 캐시되므로 캐시를 덤프해도 드러나지 않습니다.

**제공업체 오류는 길이를 제한합니다.** 제공업체가 거부 사유를 알려 주면, 디버깅하기 쉽도록 그 메시지를 200자로 잘라 보존합니다. 원본 응답 본문은 절대 포함하지 않습니다. 이 메시지는 발송이 실패할 때 로그에 기록됩니다. 제공업체가 오류 메시지에 요청 내용 일부를 그대로 되돌려 보낼 수도 있으니, SMS 실패 로그는 민감한 정보로 다루세요.

**로그의 전화번호는 가려집니다.** 패키지가 남기는 로그에는 `***4567`처럼 표시되며, 전체 번호는 나오지 않습니다.

**큐에 들어간 메시지는 암호화됩니다.** 큐에 들어간 모든 SMS 작업은 `APP_KEY`로 암호화되므로, Redis나 데이터베이스, SQS에서 로그인 코드를 읽을 수 없습니다.

**웹훅은 기본적으로 닫혀 있습니다.** 시크릿이 설정되지 않은 웹훅 엔드포인트는 모든 요청을 거부합니다. 시크릿이 있으면 서명을 상수 시간으로 비교합니다. 자세한 내용은 [웹훅](/ko/guide/webhooks)을 참고하세요.

**입력은 보내기 전에 검사합니다.** 형식이 잘못된 번호, 빈 메시지, 알 수 없는 제공업체는 요청을 보내기 전에 실패합니다. Infobip이나 Termii처럼 기본 URL을 설정할 수 있는 제공업체는 반드시 HTTPS를 써야 합니다.

## 직접 챙겨야 할 것 {#what-s-up-to-you}

- **인증 정보는 환경 변수**나 시크릿 매니저에 보관하고, 소스 저장소에는 절대 넣지 마세요. 유출되면 즉시 교체하세요.
- **SMS를 보내는 엔드포인트에는 요청 제한을 거세요.** 로그인 코드를 문자로 보내는 로그인 폼은 공격자가 유료 번호로 문자를 보내게 만들어 그 비용을 떠넘기는 "SMS 펌핑" 사기의 손쉬운 표적입니다. 전화번호별, IP 주소별로 제한하세요(아래 참고).
- **웹훅은 필요할 때까지 꺼 두고**, 켤 때는 HTTPS로 받으세요.
- **프로덕션에서는 `log` 드라이버를 쓰지 마세요.** 코드를 포함한 메시지 본문 전체를 로그 파일에 기록합니다.
- **`APP_KEY`를 보호하세요.** 큐에 들어간 메시지를 복호화하는 키입니다. 교체할 때는 이전 키를 `APP_PREVIOUS_KEYS`에 넣어 두어야 이미 큐에 있는 작업을 읽을 수 있습니다.
- **Laravel과 패키지를 최신 상태로 유지하세요.** Laravel 11은 더 이상 보안 패치를 받지 않습니다.

## 로그인 코드 발송 제한 {#rate-limiting-login-codes}

Laravel의 `RateLimiter`를 쓰면 번호별 제한을 몇 줄로 구현할 수 있습니다.

```php
use Illuminate\Support\Facades\RateLimiter;
use MrRijal\LaravelSms\Facades\Sms;

$sent = RateLimiter::attempt(
    key: 'sms-code:'.$request->string('phone'),
    maxAttempts: 3,
    callback: fn () => Sms::to($request->string('phone'))->message("Your code is {$code}")->sendNow(),
    decaySeconds: 600,
);

if (! $sent) {
    return back()->withErrors(['phone' => 'Too many codes requested. Try again in a few minutes.']);
}
```

IP 주소별 제한은 라우트에 `throttle` 미들웨어를 걸어 하나 더 추가하세요. 예를 들면 `->middleware('throttle:10,1')`입니다.

## 취약점 제보 {#reporting-a-vulnerability}

공개 이슈를 여는 대신 [prashantrijal.721@gmail.com](mailto:prashantrijal.721@gmail.com)으로 이메일을 보내 주세요. 최대한 빨리 답장을 드리며, 세부 내용이 공개되기 전에 수정 버전을 먼저 배포합니다.
