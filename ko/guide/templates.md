# 템플릿

<p class="lead">자유 형식으로 보낼 수 없는 메시지도 있습니다. 인도에서는 모든 상업용 SMS가 등록된 템플릿과 일치해야 하고, WhatsApp에서는 승인된 템플릿으로만 비즈니스가 먼저 대화를 시작할 수 있습니다. 이 페이지에서는 템플릿을 설정하고 보내는 방법을 설명합니다.</p>

## 템플릿이 필요한 경우 {#when-you-need-a-template}

| 상황 | 이유 |
|---|---|
| 인도 번호로 보낼 때 | DLT 규제에 따라 모든 상업용 메시지는 통신사에 등록된 템플릿과 일치해야 합니다 |
| WhatsApp 대화를 먼저 시작할 때 | 고객의 마지막 메시지로부터 24시간이 지나면, WhatsApp은 승인된 템플릿만 전달합니다 |
| 문구를 코드에서 분리하고 싶을 때 | 마케팅팀이나 고객지원팀이 배포 없이 제공업체 대시보드에서 문구를 고칠 수 있습니다 |

템플릿은 **[MSG91](/ko/providers/msg91)**, **[WhatsApp](/ko/providers/whatsapp)**, **[Brevo](/ko/providers/brevo)**에서 지원합니다. 다른 제공업체는 모두 본문을 보냅니다.

## 템플릿 보내기 {#sending-a-template}

템플릿 ID와 변수를 넘기세요.

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

ID와 변수가 뜻하는 바는 제공업체마다 조금씩 다릅니다.

## 제공업체별 해석 방식 {#how-each-provider-reads-them}

### MSG91 {#msg91}

ID는 MSG91 대시보드의 **Flow ID**입니다. 변수 이름은 Flow에 정의한 변수와 일치해야 하며, 모든 수신자가 같은 값을 받습니다.

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

모든 수신자를 요청 하나로 보냅니다. 발신자 ID(`MSG91_SENDER`)도 템플릿과 함께 DLT에 등록되어 있어야 합니다.

### WhatsApp {#whatsapp}

ID는 WhatsApp Manager에 표시된 그대로의 **템플릿 이름**입니다. 변수는 템플릿 본문의 플레이스홀더를 **순서대로** 채웁니다. 첫 번째 값이 <code v-pre>{{1}}</code>을, 두 번째 값이 <code v-pre>{{2}}</code>를 대체하는 식입니다. 배열 키는 코드를 읽기 쉽게 하려는 용도일 뿐입니다.

```php
// 템플릿 "order_update": "Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

모든 메시지는 `WHATSAPP_TEMPLATE_LANGUAGE`(기본값 `en`)에 설정한 언어를 씁니다. 이 값은 `en_US`나 `pt_BR`처럼 템플릿이 승인된 언어 중 하나와 일치해야 합니다.

::: info 본문만 지원합니다
드라이버는 본문의 플레이스홀더만 채웁니다. 헤더 미디어, URL 버튼 같은 다른 구성 요소가 있는 템플릿은 WhatsApp API를 직접 호출하거나 [직접 만든 드라이버](/ko/guide/custom-drivers)를 써야 합니다.
:::

### Brevo {#brevo}

ID는 Brevo의 **SMS 템플릿 ID**이며, 변수는 템플릿의 `params`가 됩니다.

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## 본문으로 대체 발송하기 {#templates-with-a-text-fallback}

메시지에는 템플릿과 일반 본문을 **함께** 담을 수 있습니다. 템플릿을 지원하는 제공업체는 템플릿을 보내고, 나머지 제공업체는 본문을 보냅니다. 덕분에 템플릿을 [페일오버](/ko/guide/failover)와 함께 써도 안전합니다.

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

MSG91은 DLT 템플릿을 보냅니다. MSG91을 쓸 수 없으면 Twilio가 대신 본문을 보냅니다.

템플릿만 있는 메시지를 본문만 지원하는 제공업체로 보내면, 아무것도 보내기 전에 해당 제공업체 이름이 담긴 `InvalidMessageException`이 발생합니다. 페일오버 체인에서는 그 제공업체를 그냥 건너뜁니다.

## 템플릿 ID를 코드에서 분리하기 {#keeping-template-ids-out-of-your-code}

템플릿 ID는 의미를 알 수 없는 문자열이라 오타가 나기 쉽습니다. backed enum을 쓰면 템플릿마다 이름이 생기고, 자동 완성이 되며, 바꿀 곳도 한 군데로 모입니다.

```php
namespace App\Enums;

enum SmsTemplate: string
{
    case LoginCode = '6512a8d3f1c2b';
    case OrderShipped = '6512a9e07a4d1';
}
```

```php
use App\Enums\SmsTemplate;

Sms::to($user->phone)
    ->template(SmsTemplate::LoginCode->value, ['otp' => $code])
    ->send();
```

환경마다 ID가 다르다면 `config/services.php`에 두고 `config('services.msg91.templates.login_code')`로 읽으세요.

## 알림에서 템플릿 쓰기 {#templates-in-notifications}

`toSms()`는 다른 메시지와 마찬가지로 템플릿 메시지도 반환할 수 있습니다.

```php
use App\Enums\SmsTemplate;
use MrRijal\LaravelSms\SmsMessage;

public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create()
        ->template(SmsTemplate::OrderShipped->value, ['order' => $this->order->number])
        ->provider('msg91');
}
```

기본 제공 알림을 써도 됩니다.

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## 템플릿 메시지 테스트하기 {#testing-template-messages}

`Sms::fake()`는 템플릿 ID와 변수도 기록하므로 어서션으로 확인할 수 있습니다.

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
