# Resultados e erros

<p class="lead">Um SMS só tem utilidade se chegar. Todo envio informa o que o provedor aceitou e, quando algo dá errado, exatamente quais destinatários foram afetados.</p>

## O resultado {#the-result}

O `sendNow()` devolve um `SmsResult`:

```php
$result = Sms::to(['+15551234567', '+15557654321'])
    ->message('Hi')
    ->sendNow();

$result->provider;      // "twilio"
$result->recipients();  // ["+15551234567", "+15557654321"]
$result->ids();         // ["SM1a…", "SM2b…"]
$result->firstId();     // "SM1a…"
count($result);         // 2

foreach ($result->messages as $sent) {
    $sent->to;      // "+15551234567"
    $sent->id;      // "SM1a…"
    $sent->status;  // "queued", do jeito que o provedor informou
}
```

Guarde o ID da mensagem. É ele que liga tudo: os relatórios de entrega do provedor, os chamados de suporte ("cadê a mensagem SM1a…?") e os [webhooks](/pt/guide/webhooks), que você associa à mensagem que os disparou.

::: info Aceita, não entregue
Um resultado significa que o provedor **aceitou** a mensagem. A entrega no aparelho acontece alguns segundos depois e ainda pode falhar se o celular estiver desligado ou se o número tiver mudado. Use [webhooks](/pt/guide/webhooks) para acompanhar a entrega final.
:::

O `sendNow()` devolve `null` em um único caso: quando um [listener de `SmsSending`](/pt/guide/events#cancelling-a-send) cancelou o envio. O `send()` também devolve `null` quando coloca a mensagem na fila em vez de enviá-la.

## Quando o provedor diz não {#when-a-provider-says-no}

Um envio recusado, ou para um provedor fora do ar, lança uma `DeliveryException`. A mensagem dela é escrita para pessoas e pode ir para o log sem problema:

```text
Failed to send SMS via Twilio (HTTP 400): The 'To' number +1555 is not a valid phone number.
```

A explicação do próprio provedor vem junto, cortada em 200 caracteres. Suas credenciais, nunca.

```php
use MrRijal\LaravelSms\Exceptions\DeliveryException;

try {
    $result = Sms::to($numbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    $e->provider;               // "Twilio"
    $e->getCode();              // 400, o status HTTP quando houver um
    $e->failedRecipients;       // números que o provedor não aceitou
    $e->partial?->recipients(); // números que ele aceitou antes de falhar
}
```

## Falhas parciais {#partial-failures}

Envie para cem pessoas e talvez um número seja inválido. O pacote não finge que o envio inteiro falhou, nem esconde o número que falhou:

```php
try {
    Sms::to($hundredNumbers)->message('Hi')->sendNow();
} catch (DeliveryException $e) {
    if ($e->hasPartialDelivery()) {
        // 99 pessoas já receberam a mensagem. Não envie de novo para elas.
        $delivered = $e->partial->recipients();
    }

    // Tente de novo, marque ou reporte só estes.
    $e->failedRecipients;
}
```

A mensagem também diz quantos falharam: `… (1 of 100 recipients failed)`.

É isso também que torna o [failover](/pt/guide/failover) seguro: o próximo provedor só recebe os `failedRecipients`.

## Todas as exceções que o pacote lança {#every-exception-the-package-throws}

Todas implementam `MrRijal\LaravelSms\Exceptions\SmsException`, então um único `catch` cobre o pacote inteiro:

| Exceção | Estende | Lançada quando |
|---|---|---|
| `DeliveryException` | `RuntimeException` | Um provedor recusou a mensagem, não respondeu ou a autenticação falhou |
| `InvalidMessageException` | `InvalidArgumentException` | Um número está malformado, o texto está vazio ou longo demais, ou o provedor não consegue enviar esse tipo de mensagem |
| `InvalidConfigurationException` | `InvalidArgumentException` | Um provedor é desconhecido, ou as credenciais ou configurações dele estão faltando ou são inválidas |

Mensagens e configurações inválidas falham **antes** de qualquer envio, então você nunca paga por um erro pela metade.
