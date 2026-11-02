# Amazon SNS

<p class="lead">AWS 계정에서 SNS로 SMS를 보냅니다. 애플리케이션이 이미 AWS에서 돌아가고 있고 비용을 한곳에서 청구받고 싶다면 안성맞춤입니다.</p>

| | |
|---|---|
| 드라이버 키 | `aws_sns` |
| 지원 지역 | 전 세계 |
| 발송 방식 | AWS SDK를 통해 수신자 한 명씩 발송 |
| 템플릿 | 지원 안 함 (본문만) |
| 전송 상태 웹훅 | 지원 안 함 |
| 웹사이트 | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## 설치 {#install}

이 드라이버는 AWS SDK가 필요합니다.

```bash
composer require aws/aws-sdk-php
```

## 설정 {#configure}

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SNS_SENDER_ID=
AWS_SNS_SMS_TYPE=
```

| 변수 | |
|---|---|
| `AWS_DEFAULT_REGION` | 발송할 리전. 예: `us-east-1` |
| `AWS_ACCESS_KEY_ID` | 선택 사항. 생략하면 기본 자격 증명 체인을 사용합니다 |
| `AWS_SECRET_ACCESS_KEY` | 선택 사항. 위 키와 함께 설정합니다 |
| `AWS_SNS_SENDER_ID` | 선택 사항. 영숫자 발신자 ID |
| `AWS_SNS_SMS_TYPE` | `Transactional`(기본값) 또는 `Promotional` |

실제 문자를 보내 설정을 확인하세요.

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## 발송 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 알아 두면 좋은 점 {#good-to-know}

- EC2, ECS, Lambda, Vapor에서는 액세스 키를 비워 두세요. SDK가 인스턴스나 태스크 역할(role)을 사용하므로, 수명이 긴 키를 `.env`에 둘 필요가 없습니다.
- 새 AWS 계정은 SMS 샌드박스에서 시작하며, 인증된 번호로만 문자를 보낼 수 있습니다. 서비스를 오픈하기 전에 SNS 콘솔에서 프로덕션 액세스를 요청하세요.
- SNS는 내부적으로 AWS End User Messaging을 통해 SMS를 보냅니다. 따라서 지출 한도, 발신 번호, 발신자 ID는 그 콘솔에서 관리합니다.
