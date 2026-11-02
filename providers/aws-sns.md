# Amazon SNS

<p class="lead">Send SMS from your AWS account with SNS. Ideal if your application already runs on AWS and you want billing in one place.</p>

| | |
|---|---|
| Driver key | `aws_sns` |
| Coverage | Global |
| Sending | Through the AWS SDK, one recipient at a time. |
| Templates | No, text only |
| Delivery webhooks | No |
| Website | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## Install

This driver needs the AWS SDK:

```bash
composer require aws/aws-sdk-php
```

## Configure

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SNS_SENDER_ID=
AWS_SNS_SMS_TYPE=
```

| Variable | |
|---|---|
| `AWS_DEFAULT_REGION` | Region to send from, such as `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Optional. Omit to use the default credential chain |
| `AWS_SECRET_ACCESS_KEY` | Optional, with the key above |
| `AWS_SNS_SENDER_ID` | Optional alphanumeric sender ID |
| `AWS_SNS_SMS_TYPE` | `Transactional` (default) or `Promotional` |

Check the setup with a real message:

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## Send

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## Good to know

- Leave the access keys empty on EC2, ECS, Lambda or Vapor, and the SDK uses the instance or task role. That way no long-lived keys sit in your `.env`.
- New AWS accounts start in the SMS sandbox and can only text verified numbers. Request production access in the SNS console before going live.
- SNS sends SMS through AWS End User Messaging behind the scenes, so spending limits, origination numbers and sender IDs are managed in that console.
