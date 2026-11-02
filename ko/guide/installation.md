# 설치

<p class="lead">Composer 명령어 한 줄과 <code>.env</code> 몇 줄이면 끝납니다. 서비스 프로바이더와 <code>Sms</code> 파사드는 자동으로 등록됩니다.</p>

## 패키지 설치 {#install-the-package}

```bash
composer require mr-rijal/laravel-sms
```

다음으로 설정 파일을 퍼블리시합니다. 두 번째 제공업체를 추가하거나 기본값을 바꿀 때 필요해집니다.

```bash
php artisan vendor:publish --tag=sms-config
```

`config/sms.php` 파일이 생성됩니다. 모든 값을 환경 변수에서 읽어 오기 때문에, 대부분의 프로젝트는 이 파일을 직접 고칠 일이 없습니다.

## 제공업체 선택 {#choose-a-provider}

기본 제공업체와 인증 정보를 설정합니다. Twilio라면 다음과 같습니다.

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

제공업체마다 필요한 변수는 각 제공업체 페이지에 정리되어 있습니다. 아직 정하지 못했다면 [제공업체 개요](/ko/providers/)부터 살펴보세요.

::: tip 로컬에서 개발 중인가요?
`SMS_PROVIDER`를 비워 두세요. 기본값은 `log` 드라이버로, 메시지를 실제로 보내는 대신 Laravel 로그에 기록합니다. 실수로 실제 휴대폰에 문자가 가는 일이 없습니다.
:::

## 동작 확인 {#check-that-it-works}

터미널에서 실제 문자를 보내 보세요. 애플리케이션과 정확히 같은 코드 경로를 거칩니다.

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

문제가 있으면 제공업체가 보낸 응답을 그대로 보여 줍니다. 예를 들면 `Failed to send SMS via Twilio (HTTP 401): Authenticate` 같은 식입니다. 특정 제공업체로 시험하려면 `--provider=sinch`를, 원하는 문구로 보내려면 `--message="Hello"`를 사용하세요.

`php artisan about`에도 **Laravel SMS** 섹션이 추가되어 기본 제공업체와 큐, 웹훅 사용 여부를 보여 줍니다.

## 선택 사항: Amazon SNS {#optional-amazon-sns}

AWS SDK는 용량이 커서 필요할 때만 설치하도록 했습니다. [Amazon SNS](/ko/providers/aws-sns) 드라이버를 쓸 계획이라면 다음을 실행하세요.

```bash
composer require aws/aws-sdk-php
```

## 다음 단계 {#next-steps}

[첫 문자 보내기 →](/ko/guide/quick-start)
