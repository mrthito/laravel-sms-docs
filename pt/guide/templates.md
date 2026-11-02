# Templates

<p class="lead">Algumas mensagens não podem ser texto livre. Na Índia, todo SMS comercial precisa seguir um template registrado, e o WhatsApp só deixa empresas iniciarem uma conversa com um template aprovado. Esta página mostra como configurar e enviar templates.</p>

## Quando você precisa de um template {#when-you-need-a-template}

| Situação | Por quê |
|---|---|
| Envio para números da Índia | As regras de DLT exigem que toda mensagem comercial siga um template registrado nas operadoras |
| Iniciar uma conversa no WhatsApp | Fora das 24 horas seguintes à última mensagem do cliente, o WhatsApp só entrega templates aprovados |
| Tirar o texto de dentro do código | As equipes de marketing ou de suporte podem editar o texto no painel do provedor sem precisar de deploy |

Templates são suportados pelo **[MSG91](/pt/providers/msg91)**, pelo **[WhatsApp](/pt/providers/whatsapp)** e pela **[Brevo](/pt/providers/brevo)**. Todos os outros provedores enviam texto.

## Enviando um template {#sending-a-template}

Passe o ID do template e as variáveis dele:

```php
use MrRijal\LaravelSms\Facades\Sms;

Sms::provider('msg91')
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->send();
```

O ID e as variáveis têm significados um pouco diferentes em cada provedor.

## Como cada provedor os interpreta {#how-each-provider-reads-them}

### MSG91 {#msg91}

O ID é o **Flow ID** que aparece no painel do MSG91. Os nomes das variáveis precisam bater com as variáveis do seu Flow, e todos os destinatários recebem os mesmos valores.

```php
Sms::provider('msg91')
    ->to($customers)
    ->template('6512a8d3f1c2b', ['name' => 'Asha', 'otp' => '4821'])
    ->send();
```

Todos os destinatários saem em uma única requisição. O seu sender ID (`MSG91_SENDER`) precisa estar registrado na DLT junto com o template.

### WhatsApp {#whatsapp}

O ID é o **nome do template**, exatamente como aparece no WhatsApp Manager. As variáveis preenchem os placeholders do corpo do template **em ordem**: o primeiro valor substitui <code v-pre>{{1}}</code>, o segundo <code v-pre>{{2}}</code>, e assim por diante. As chaves do array servem só para deixar o código mais legível para você.

```php
// Template "order_update": "Hi {{1}}, order {{2}} is on its way."
Sms::provider('whatsapp')
    ->to('+447700900123')
    ->template('order_update', ['name' => 'Ana', 'order' => '#4821'])
    ->send();
```

Toda mensagem usa o idioma definido em `WHATSAPP_TEMPLATE_LANGUAGE` (padrão `en`). Ele precisa corresponder a um idioma em que o seu template foi aprovado, como `en_US` ou `pt_BR`.

::: info Só o texto do corpo
O driver preenche os placeholders do corpo. Templates com mídia no cabeçalho, botões de URL ou outros componentes exigem usar a API do WhatsApp diretamente, ou um [driver próprio](/pt/guide/custom-drivers).
:::

### Brevo {#brevo}

O ID é o **ID do template de SMS** na Brevo, e as variáveis viram os `params` do template:

```php
Sms::provider('brevo')
    ->to('+33612345678')
    ->template('12', ['code' => '4821'])
    ->send();
```

## Templates com texto de reserva {#templates-with-a-text-fallback}

Uma mensagem pode levar um template **e** um texto simples. Provedores que aceitam templates enviam o template; todos os outros enviam o texto. Isso torna seguro combinar templates com [failover](/pt/guide/failover):

```php
Sms::provider('failover')                // SMS_FAILOVER_DRIVERS=msg91,twilio
    ->to('+919812345678')
    ->template('6512a8d3f1c2b', ['otp' => 4821])
    ->message('Your verification code is 4821.')
    ->send();
```

O MSG91 envia o template da DLT. Se ele estiver indisponível, a Twilio envia o texto no lugar.

Uma mensagem só com template enviada para um provedor que só aceita texto lança uma `InvalidMessageException` com o nome do provedor, antes de qualquer envio. Em uma cadeia de failover, esse provedor simplesmente é pulado.

## Tirando os IDs de template do seu código {#keeping-template-ids-out-of-your-code}

IDs de template são strings opacas e fáceis de digitar errado. Um backed enum dá a cada template um nome, autocompletar e um único lugar para alterá-lo:

```php
namespace App\Enums;

enum SmsTemplate: string
{
    case LoginCode = '6512a8d3f1c2b';
    case OrderShipped = '6512a9e07a4d1';
}
```

```php
use App\Enums\SmsTemplate;

Sms::to($user->phone)
    ->template(SmsTemplate::LoginCode->value, ['otp' => $code])
    ->send();
```

Se os IDs mudarem de um ambiente para outro, guarde-os no `config/services.php` e leia-os com `config('services.msg91.templates.login_code')`.

## Templates em notificações {#templates-in-notifications}

O `toSms()` pode devolver uma mensagem com template como qualquer outra:

```php
use App\Enums\SmsTemplate;
use MrRijal\LaravelSms\SmsMessage;

public function toSms(object $notifiable): SmsMessage
{
    return SmsMessage::create()
        ->template(SmsTemplate::OrderShipped->value, ['order' => $this->order->number])
        ->provider('msg91');
}
```

Ou use a notificação pronta:

```php
$user->notify(new SmsNotification(
    templateId: SmsTemplate::LoginCode->value,
    variables: ['otp' => $code],
    provider: 'msg91',
));
```

## Testando mensagens com template {#testing-template-messages}

O `Sms::fake()` registra o ID do template e as variáveis, então você pode fazer asserções sobre eles:

```php
use MrRijal\LaravelSms\SmsMessage;

Sms::fake();

$this->post('/login', ['phone' => '+919812345678']);

Sms::assertSent(fn (SmsMessage $sms) =>
    $sms->getTemplateId() === SmsTemplate::LoginCode->value
    && $sms->getVariables()['otp'] !== null
);
```
