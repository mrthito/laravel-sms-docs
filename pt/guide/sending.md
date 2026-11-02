# Montando mensagens

<p class="lead">Todo envio começa na facade <code>Sms</code> e termina com um de quatro verbos. Tudo o que fica no meio descreve a mensagem.</p>

## O builder {#the-builder}

Chamar `Sms::to()`, `Sms::provider()`, `Sms::message()` ou `Sms::template()` devolve um `PendingSms` novo. Encadeie o que precisar e termine com um verbo:

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('vonage')               // opcional: o padrão é o SMS_PROVIDER
    ->to(['+447700900123', '+447700900456'])
    ->from('ACME')                    // opcional: substitui o remetente configurado
    ->message('Doors open at 7pm.')
    ->send();
```

| Verbo | O que faz | Retorno |
|---|---|---|
| `send()` | Envia na hora, ou coloca na fila quando `SMS_QUEUE=true` | `SmsResult`, ou `null` quando vai para a fila |
| `sendNow()` | Sempre envia na hora | `SmsResult` (ou `null` se um listener cancelar) |
| `sendLater()` | Sempre coloca na fila | nada |
| `sendLaterAt($when)` | Coloca na fila com atraso (`later()` é um alias) | nada |

Como cada chamada à facade começa um builder novo, dois envios nunca compartilham destinatários nem texto, nem mesmo dentro de um worker do Octane que roda por muito tempo.

## Destinatários {#recipients}

O `to()` aceita um único número, um array ou qualquer iterável, inclusive uma collection:

```php
Sms::to('+15551234567');
Sms::to(['+15551234567', '+15557654321']);
Sms::to(User::whereNotNull('phone')->pluck('phone'));
```

Cada número é limpo e validado no momento em que você o adiciona:

- Espaços, hífens, pontos e parênteses são removidos.
- O que sobra precisa ter de 7 a 15 dígitos, podendo começar com `+`. Qualquer outra coisa lança uma `InvalidMessageException` na hora, em vez de falhar mais tarde no provedor.
- Duplicatas são descartadas, então a mesma pessoa nunca recebe duas mensagens no mesmo envio.

::: tip Use E.164
Guarde e envie os números no formato internacional: `+` seguido do código do país e do número. Alguns provedores recusam formatos locais de cara, e outros mandam a mensagem para o país errado.
:::

## Texto {#text}

```php
Sms::to($phone)->message('Your table is ready.');
```

O texto passa por trim e não pode ficar vazio. As mensagens podem ter até 1.600 caracteres. Os provedores dividem tudo o que passa de um SMS (160 caracteres GSM, ou 70 com emoji e outros caracteres Unicode) em várias partes e cobram cada parte, então mensagens curtas saem mais baratas.

O `content()` é um alias de `message()`, caso você prefira o nome usado nas notificações do Laravel.

## Templates {#templates}

Alguns provedores enviam templates pré-aprovados em vez de texto livre. Na Índia, as regras de DLT exigem isso; o WhatsApp exige templates para conversas iniciadas pela empresa.

```php
Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

Templates são suportados pelo [MSG91](/pt/providers/msg91), pelo [WhatsApp](/pt/providers/whatsapp) e pela [Brevo](/pt/providers/brevo). Os demais provedores precisam de texto: mandar para eles uma mensagem só com template lança uma `InvalidMessageException` que informa o nome do provedor.

## Remetente {#sender}

Cada provedor tem um remetente configurado, como um número ou um ID alfanumérico tipo `ACME`. Para trocar o remetente de uma única mensagem, use `from()`:

```php
Sms::to($phone)->from('ACME Alerts')->message('Your parcel is out for delivery.')->send();
```

Remetentes alfanuméricos não são permitidos em todo lugar. Nos Estados Unidos e no Canadá, você precisa enviar a partir de um número registrado, então confira as regras do seu provedor para cada país para onde você envia.

## Escolhendo um provedor {#choosing-a-provider}

O `provider()` envia esta mensagem por um provedor específico, em vez do padrão:

```php
Sms::provider('termii')->to('+2348012345678')->message('Hello Lagos')->send();
```

Dois nomes são especiais: `failover` tenta uma cadeia de provedores em ordem, e `random` sorteia um de um pool. Os dois são explicados em [Failover e balanceamento de carga](/pt/guide/failover).

## Partes condicionais {#conditional-parts}

O `PendingSms` aceita o `when()` e o `unless()` do Laravel:

```php
Sms::to($order->customer_phone)
    ->message("Order #{$order->id} has shipped.")
    ->when($order->express, fn ($sms) => $sms->provider('twilio'))
    ->send();
```

## Montando uma mensagem com antecedência {#building-a-message-ahead-of-time}

O `SmsMessage` é um objeto simples que você pode montar, passar adiante e enviar depois:

```php
use MrRijal\LaravelSms\SmsMessage;

$message = SmsMessage::create('Maintenance tonight from 10pm.')
    ->to($admins)
    ->provider('sinch');

Sms::sendNow($message);
```

## Macros {#macros}

Dê um nome próprio às mensagens que se repetem:

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Sms::macro('sendOtp', function (string $phone, int $code) {
        return $this->to($phone)->template('otp', ['code' => $code])->sendNow();
    });
}

// Em qualquer lugar da sua aplicação
Sms::sendOtp($user->phone, 4821);
```
