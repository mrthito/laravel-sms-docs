# Amazon SNS

<p class="lead">通过 SNS 从你的 AWS 账户发送短信。如果应用本来就跑在 AWS 上，又希望账单集中在一处，它是理想之选。</p>

| | |
|---|---|
| 驱动键名 | `aws_sns` |
| 覆盖范围 | 全球 |
| 发送方式 | 通过 AWS SDK，一次发送一个收件人。 |
| 模板 | 不支持，仅文本 |
| 送达 Webhook | 不支持 |
| 官网 | [aws.amazon.com/sns](https://aws.amazon.com/sns/) |

## 安装 {#install}

此驱动需要 AWS SDK：

```bash
composer require aws/aws-sdk-php
```

## 配置 {#configure}

```ini [.env]
SMS_PROVIDER=aws_sns

AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SNS_SENDER_ID=
AWS_SNS_SMS_TYPE=
```

| 变量 | |
|---|---|
| `AWS_DEFAULT_REGION` | 发送所用的区域，例如 `us-east-1` |
| `AWS_ACCESS_KEY_ID` | 可选。留空则使用默认凭据链 |
| `AWS_SECRET_ACCESS_KEY` | 可选，与上面的 key 配套使用 |
| `AWS_SNS_SENDER_ID` | 可选的字母数字发送方 ID |
| `AWS_SNS_SMS_TYPE` | `Transactional`（默认）或 `Promotional` |

发一条真实短信验证配置：

```bash
php artisan sms:test +15551234567 --provider=aws_sns
```

## 发送 {#send}

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('aws_sns')
    ->to('+15551234567')
    ->message('Your verification code is 4821.')
    ->send();
```

## 注意事项 {#good-to-know}

- 在 EC2、ECS、Lambda 或 Vapor 上，把访问密钥留空，SDK 就会使用实例或任务角色。这样你的 `.env` 里就不会存放长期有效的密钥。
- 新的 AWS 账户默认处于短信沙盒中，只能给已验证的号码发短信。上线前请在 SNS 控制台申请生产环境访问权限。
- SNS 在底层通过 AWS End User Messaging 发送短信，所以消费上限、始发号码和发送方 ID 都在那个控制台中管理。
