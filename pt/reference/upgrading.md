# Atualizando da 1.x

<p class="lead">A versão 2 reconstrói o núcleo em torno de resultados, e não de booleanos. A maioria das aplicações só precisa dos três primeiros passos, que levam cerca de meia hora.</p>

## 1. Atualize o pacote {#_1-update-the-package}

```bash
composer require mr-rijal/laravel-sms:^2.0
```

Se você usa o driver do **AWS SNS**, o SDK da AWS não é mais instalado automaticamente:

```bash
composer require aws/aws-sdk-php
```

## 2. Publique de novo ou mescle a configuração {#_2-re-publish-or-merge-the-config}

```bash
php artisan vendor:publish --tag=sms-config --force
```

Se o seu `config/sms.php` é personalizado, mescle estas mudanças manualmente:

- O `default` agora cai para `log` em vez de `fake`.
- Novas seções: `retry`, `http` e `providers.failover`.
- Novos provedores: `sinch`, `bird`, `clicksend`, `clickatell`, `brevo`, `bandwidth`, `sendpulse`.
- Provedores removidos: `telegram_mirror`, `discord_webhook`, `slack_webhook`.

## 3. Resultados no lugar de booleanos {#_3-send-results-instead-of-booleans}

O `send()`, o `sendNow()` e os helpers do `HasSms` agora devolvem `?SmsResult` em vez de `bool`.

```php
// 1.x
if (Sms::to($n)->message('Hi')->sendNow()) { ... }

// 2.0
$result = Sms::to($n)->message('Hi')->sendNow();
$result?->firstId();
```

O resultado é `null` quando um listener de `SmsSending` cancela o envio, ou quando o `send()` coloca a mensagem na fila. As falhas continuam lançando exceções, como na 1.x.

## Drivers removidos {#removed-drivers}

Os drivers de espelhamento para Telegram, Discord e Slack foram removidos: eles nunca entregaram um SMS. Se você os usava para alertas internos, escute o evento `SmsSent` e publique no seu canal com uma notificação do Laravel.

## Exceções {#exceptions}

Falhas do provedor lançam `MrRijal\LaravelSms\Exceptions\DeliveryException` (que continua sendo uma `RuntimeException`). Entrada inválida lança `InvalidMessageException`, e configuração incorreta lança `InvalidConfigurationException` (as duas continuam sendo `InvalidArgumentException`). Capture `MrRijal\LaravelSms\Exceptions\SmsException` para tratar todas elas.

`DeliveryException::$failedRecipients` e `DeliveryException::$partial` dizem quem recebeu e quem não recebeu a mensagem.

## Eventos {#events}

- O `SmsSent` não tem mais as propriedades `success` e `error`. Ele só é disparado em caso de sucesso e traz o `result` (um `SmsResult`).
- As falhas disparam o novo evento `SmsFailed`, com a `exception`.
- Os listeners de `SmsSending` agora podem devolver `false` para cancelar o envio.

## Notificações {#notifications}

O `toSms()` agora deve **devolver** um `SmsMessage` (ou uma string), em vez de enviar a mensagem ele mesmo. O canal faz o roteamento com o `routeNotificationForSms()` e aceita `Notification::route('sms', $number)`.

```php
// 1.x
public function toSms($notifiable): void
{
    Sms::to($notifiable->phone)->message('Shipped')->sendNow();
}

// 2.0
public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create('Shipped');
}
```

A `SmsNotification` não lê mais o `sms.queue`. Para colocar notificações na fila, implemente `ShouldQueue` na sua notificação, como em qualquer notificação do Laravel.

## Facade e manager {#facade-and-manager}

- `Sms::to()`, `Sms::provider()`, `Sms::message()` e `Sms::template()` agora devolvem um `PendingSms` novo a cada chamada, então nenhum estado é compartilhado entre envios.
- O `Sms::sendMessage($message, $provider)` foi substituído por `Sms::sendNow($message->provider($provider))`.
- O `SmsManager` é construído com o container. Resolva-o pelo container (`app(SmsManager::class)`) em vez de chamar `new SmsManager`.

## Drivers próprios {#custom-drivers}

O `SmsProvider::send()` agora precisa devolver um `SmsResult`:

```php
public function send(SmsMessage $message): SmsResult
{
    // ... chama o provedor ...

    return SmsResult::accepted($message->getTo(), $providerMessageId);
}
```

Estenda o `MrRijal\LaravelSms\Drivers\HttpDriver` para ganhar de graça validação de configuração, timeouts, envios em paralelo, tratamento de falhas parciais e mensagens de erro seguras. Os drivers agora usam o HTTP client do Laravel, então os construtores não aceitam mais um `Client` do Guzzle; use `Http::fake()` nos testes.

## Testes {#testing}

Substitua as asserções com `FakeDriver::$messages` pelo `Sms::fake()`:

```php
Sms::fake();
// ...
Sms::assertSentTo('+15551234567');
```

O `FakeDriver` continua existindo para as aplicações que dependem dele.
