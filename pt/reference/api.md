# API

<p class="lead">As classes e os métodos públicos que você vai usar no dia a dia, em uma só página.</p>

## Facade Sms {#sms-facade}

A `MrRijal\LaravelSms\Facades\Sms` repassa as chamadas para o `SmsManager`.

| Método | Retorno | |
|---|---|---|
| `to(string\|iterable $numbers)` | `PendingSms` | Começa uma mensagem para esses números |
| `provider(string $name)` | `PendingSms` | Começa uma mensagem por um provedor específico |
| `message(string $text)` | `PendingSms` | Começa uma mensagem com este texto |
| `template(string $id, array $vars = [])` | `PendingSms` | Começa uma mensagem com template |
| `compose(?SmsMessage $message = null)` | `PendingSms` | Envolve uma mensagem existente em um builder |
| `send(SmsMessage $message)` | `?SmsResult` | Envia, ou coloca na fila quando `sms.queue` está ativado |
| `sendNow(SmsMessage $message)` | `?SmsResult` | Envia na hora |
| `queue(SmsMessage $message, $delay = null)` | `void` | Coloca na fila um job por destinatário |
| `driver(?string $name = null)` | `SmsProvider` | A instância do driver de um provedor |
| `extend(string $name, Closure $factory)` | `SmsManager` | Registra um driver próprio |
| `getDefaultDriver()` | `string` | A chave do provedor padrão |
| `forgetDrivers()` | `SmsManager` | Descarta as instâncias de driver em cache |
| `macro(string $name, callable $macro)` | `void` | Adiciona um método seu |
| `fake()` | `SmsFake` | Troca o manager por um fake que registra os envios |

## PendingSms {#pendingsms}

Devolvido pela facade; todos os métodos, exceto os quatro verbos, devolvem o builder.

| Método | |
|---|---|
| `to(string\|iterable $numbers)` | Adiciona destinatários |
| `message(string $text)` / `content(string $text)` | Define o texto |
| `template(string $id, array $vars = [])` | Usa um template do provedor |
| `from(?string $sender)` | Substitui o remetente |
| `provider(string $name)` | Escolhe o provedor |
| `when($condition, $callback)` / `unless(…)` | Aplica alterações condicionalmente |
| `getMessage()` | O `SmsMessage` por trás do builder |
| `send()` → `?SmsResult` | Envia, ou coloca na fila quando `sms.queue` está ativado |
| `sendNow()` → `?SmsResult` | Envia na hora |
| `sendLater()` | Coloca na fila |
| `sendLaterAt($when)` / `later($when)` | Coloca na fila com atraso: uma data, um intervalo ou segundos |

## SmsMessage {#smsmessage}

O `MrRijal\LaravelSms\SmsMessage` representa uma mensagem. Os setters devolvem a própria mensagem, então dá para encadeá-los.

| Método | |
|---|---|
| `SmsMessage::create(?string $text = null)` | Nova mensagem, com texto opcional |
| `to()`, `message()`, `content()`, `template()`, `from()`, `provider()` | Como no `PendingSms` |
| `getTo()` → `list<string>` | Destinatários normalizados |
| `getText()`, `getTemplateId()`, `getFrom()`, `getProvider()` → `?string` | |
| `getVariables()` → `array` | Variáveis do template |
| `hasRecipients()` → `bool` | |
| `forRecipient(string $number)` / `forRecipients(array $numbers)` | Uma cópia endereçada a outros números |
| `getRedactedRecipientsForLogging()` → `list<string>` | Números mascarados como `***4567` |
| `validate()` | Lança `InvalidMessageException` se a mensagem não puder ser enviada |

## SmsResult {#smsresult}

| Membro | |
|---|---|
| `$provider` | Chave do provedor pelo qual a mensagem saiu |
| `$messages` | `list<SentMessage>`, um por destinatário aceito |
| `recipients()` → `list<string>` | Números aceitos |
| `ids()` → `list<string>` | IDs de mensagem do provedor, sem repetição |
| `firstId()` → `?string` | O primeiro ID de mensagem |
| `count()` | Quantidade de destinatários aceitos |

O `SentMessage` tem três propriedades somente leitura: `$to`, `$id` e `$status`.

## Exceções {#exceptions}

Todas ficam em `MrRijal\LaravelSms\Exceptions` e todas implementam `SmsException`.

| Classe | Membros |
|---|---|
| `DeliveryException` | `$provider`, `$failedRecipients`, `$partial` (`?SmsResult`), `hasPartialDelivery()`, `getCode()` (o status HTTP) |
| `InvalidMessageException` | Número malformado, texto vazio ou longo demais, tipo de mensagem não suportado |
| `InvalidConfigurationException` | Provedor desconhecido, configurações faltando ou inválidas |

## Contratos {#contracts}

| Interface | |
|---|---|
| `Contracts\SmsProvider` | `send(SmsMessage $message): SmsResult`: implemente para escrever um driver |
| `Contracts\HandlesWebhooks` | `handleWebhook(Request $request): Response`: recebe webhooks dos provedores |
| `Contracts\Factory` | Ligado ao manager no container; use-o como type-hint para injeção de dependência |

```php
use MrRijal\LaravelSms\Contracts\Factory as Sms;

class SendWelcomeText
{
    public function __construct(private Sms $sms) {}

    public function handle(User $user): void
    {
        $this->sms->to($user->phone)->message('Welcome!')->send();
    }
}
```
