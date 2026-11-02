# 安全

<p class="lead">短信里装着登录验证码、订单详情和个人手机号。本页介绍保护它们的默认机制，以及少数需要你自己决定的设置。</p>

## 扩展包为你做了什么 {#what-the-package-does-for-you}

**凭据只待在你放的地方。** API key 和 token 从你的配置中读取，只会发送给对应的服务商。它们绝不会出现在异常信息或 URL 查询字符串中；OAuth token 以哈希后的键名缓存，即使缓存被导出也不会泄露。

**服务商错误信息有长度上限。** 服务商解释拒绝原因时，扩展包只保留这段说明，并截断到 200 个字符，方便排查问题。服务商响应的其余内容绝不会被复制到异常中。发送失败时这些信息会写入日志。服务商可能在错误信息中回显你请求的部分内容，所以请把短信失败日志视为敏感数据。

**日志中的手机号会打码。** 扩展包自己写的日志只显示 `***4567`，绝不显示完整号码。

**队列中的短信会加密。** 每个进入队列的短信任务都用你的 `APP_KEY` 加密，登录验证码在 Redis、数据库或 SQS 中都无法直接读取。

**Webhook 默认拒绝。** 没有配置密钥的 Webhook 端点会拒绝所有请求。配置了密钥后，签名以恒定时间比较。详见 [Webhook 回调](/zh/guide/webhooks)。

**输入在发送前就会校验。** 格式错误的号码、空短信和未知的服务商，在发出任何请求之前就会报错。可配置的服务商基础 URL（例如 Infobip 和 Termii 的）必须使用 HTTPS。

## 需要你来把关的 {#what-s-up-to-you}

- **把凭据放在环境变量**或密钥管理服务中，绝不要提交到版本库。一旦泄露，立即轮换。
- **给发送短信的接口加上频率限制。** 一个会发验证码的登录表单，很容易成为短信刷量欺诈（SMS pumping）的目标：攻击者触发大量短信发往高价号码，费用由你承担。请按手机号和 IP 地址分别限流（见下文）。
- **用不到 Webhook 时就保持关闭**，开启后通过 HTTPS 提供服务。
- **生产环境不要使用 `log` 驱动。** 它会把完整的短信内容（包括其中的验证码）写进日志文件。
- **保护好你的 `APP_KEY`。** 它能解密队列中的短信。轮换时，把旧密钥写进 `APP_PREVIOUS_KEYS`，这样已经在队列里的任务仍然可以读取。
- **及时更新 Laravel 和扩展包。** Laravel 11 已不再提供安全修复。

## 登录验证码限流 {#rate-limiting-login-codes}

借助 Laravel 的 `RateLimiter`，按手机号限流只需几行代码：

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

再在路由上用 `throttle` 中间件按 IP 地址加一道限制，例如 `->middleware('throttle:10,1')`。

## 报告安全漏洞 {#reporting-a-vulnerability}

请发送邮件至 [prashantrijal.721@gmail.com](mailto:prashantrijal.721@gmail.com)，不要公开提交 issue。我们会尽快回复，并在公开细节之前发布修复。
