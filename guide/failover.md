# Failover and load balancing

<p class="lead">Providers have outages, and some are better in some countries than others. Chain them, and your messages keep going out while one of them is down.</p>

## Failover

List your providers in order of preference:

```ini [.env]
SMS_PROVIDER=failover
SMS_FAILOVER_DRIVERS=twilio,vonage,sinch
```

Each message goes to Twilio first. If Twilio can't take it, Vonage gets a turn, then Sinch. Each provider in the chain needs its own credentials configured, as usual.

You can also use failover for individual messages and leave your default alone:

```php
Sms::provider('failover')->to($phone)->message('Your code is 4821')->sendNow();
```

### Only the failures move on

Suppose you send to 100 people. Twilio accepts 98 and rejects two numbers its network can't reach. Failover sends **only those two** to Vonage. The 98 people who already have the message don't get it again.

```php
$result = Sms::provider('failover')->to($hundredNumbers)->message('Hi')->sendNow();

count($result);   // 100
$result->ids();   // 98 Twilio IDs, then 2 Vonage IDs
```

### What counts as a failure

Failover moves on when a provider:

- rejects some or all recipients, or can't be reached (a `DeliveryException`),
- isn't configured, or has missing credentials (an `InvalidConfigurationException`),
- can't send this kind of message, for example a template to a text-only provider (an `InvalidMessageException`).

If every provider fails, you get a `DeliveryException` that starts with *All failover providers failed*. It lists the recipients nobody accepted, and its `partial` property holds everyone who did get the message.

::: tip Put your cheapest reliable provider first
Every recipient goes to the first provider that will take them, so the order is also a cost decision. A typical setup is your main provider first and a second network as backup.
:::

## Load balancing

To spread traffic across several providers, use `random`. Each message goes to one provider picked at random from your pool:

```php
// config/sms.php
'random_drivers' => ['twilio', 'vonage'],
```

```ini [.env]
SMS_PROVIDER=random
```

`random` picks once per message. With [queueing](/guide/queueing) that means once per recipient, so a large batch spreads evenly. It doesn't retry elsewhere on failure; use `failover` for that.
