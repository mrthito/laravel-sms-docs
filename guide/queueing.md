# Queueing

<p class="lead">Talking to a provider takes a network round trip, sometimes a slow one. Queue messages sent during web requests so the people using your app never wait on a phone network.</p>

## Sending later

```php
Sms::to($user->phone)->message('Thanks for signing up!')->sendLater();
```

To send at a particular time, pass a date, an interval or a number of seconds:

```php
Sms::to($user->phone)
    ->message('Your appointment is in one hour.')
    ->sendLaterAt($appointment->starts_at->subHour());
```

## Queue everything by default

Set `SMS_QUEUE=true` and `send()` queues instead of sending immediately. `sendNow()` still sends straight away when you need it to, for example for login codes.

```ini [.env]
SMS_QUEUE=true
SMS_QUEUE_CONNECTION=redis
SMS_QUEUE_NAME=sms
```

A dedicated queue keeps a large batch of marketing messages from delaying your password resets. Run a worker for it:

```bash
php artisan queue:work redis --queue=sms
```

## One job per recipient

A message to 500 people becomes 500 small jobs, not one big one. If the provider rejects the 312th number, only that job fails and retries; the other 499 recipients are never sent the message again.

Each job is retried up to three times by default, waiting 10, 30 and then 60 seconds between attempts:

```ini [.env]
SMS_QUEUE_TRIES=3
SMS_QUEUE_TIMEOUT=120
```

::: warning Keep retry_after above the timeout
Your queue connection's `retry_after` (in `config/queue.php`) must be longer than `SMS_QUEUE_TIMEOUT`. Otherwise a slow but successful send can be picked up by a second worker and sent twice.
:::

## Encrypted at rest

Queued jobs carry phone numbers and message text, which often includes login codes. Every `SendSmsJob` implements Laravel's `ShouldBeEncrypted`, so its payload is encrypted with your `APP_KEY` while it sits in Redis, your database or SQS.

## About duplicates

Splitting jobs per recipient prevents the common duplicate: one bad number causing everyone to be re-sent. One rarer case remains, and no SMS system can rule it out completely: a provider accepts a message, but the connection drops before its answer arrives. The job can't tell that the message went out, so a retry may send it again. Delivery is **at least once**.

For messages where a duplicate would really matter, keep retries low and store the message ID you get back.
