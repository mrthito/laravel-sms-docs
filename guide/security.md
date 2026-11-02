# Security

<p class="lead">SMS carries login codes, order details and personal phone numbers. These are the defaults that protect them, and the few settings that are up to you.</p>

## What the package does for you

**Credentials stay where you put them.** API keys and tokens are read from your configuration and sent only to their provider. They're never included in exception messages or URL query strings, and OAuth tokens are cached under a hashed key, so a cache dump doesn't reveal them.

**Provider errors are bounded.** When a provider explains a rejection, the package keeps its message, cut to 200 characters, so failures are easy to debug. It never includes the raw response body. Those messages are logged when a send fails. A provider could echo back part of your request in its error, so treat SMS failure logs as sensitive.

**Phone numbers are redacted in logs.** The package's own log lines show `***4567`, never the full number.

**Queued messages are encrypted.** Every queued SMS job is encrypted with your `APP_KEY`, so login codes aren't readable in Redis, your database or SQS.

**Webhooks fail closed.** A webhook endpoint without a configured secret rejects every request. With a secret, signatures are compared in constant time. See [Webhooks](/guide/webhooks).

**Input is checked before it's sent.** Malformed numbers, empty messages and unknown providers fail before any request is made. Provider base URLs that can be configured, such as Infobip's and Termii's, must use HTTPS.

## What's up to you

- **Keep credentials in your environment** or a secrets manager, never in source control. Rotate them if they leak.
- **Rate-limit the endpoints that send SMS.** A login form that texts a code is an easy target for "SMS pumping" fraud, where attackers trigger messages to premium numbers at your expense. Limit by phone number and by IP address (see below).
- **Keep webhooks off** until you need them, and serve them over HTTPS.
- **Don't use the `log` driver in production.** It writes full message text, including any codes, to your log files.
- **Protect your `APP_KEY`.** It decrypts queued messages. When you rotate it, list the old key in `APP_PREVIOUS_KEYS` so jobs already on the queue can still be read.
- **Keep Laravel and the package up to date.** Laravel 11 no longer receives security fixes.

## Rate limiting login codes {#rate-limiting-login-codes}

Laravel's `RateLimiter` makes the per-number limit a few lines:

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

Add a second limit per IP address with the `throttle` middleware on the route, for example `->middleware('throttle:10,1')`.

## Reporting a vulnerability

Please email [prashantrijal.721@gmail.com](mailto:prashantrijal.721@gmail.com) rather than opening a public issue. You'll get a reply as soon as possible, and a fix is released before details are made public.
