# Instalação

<p class="lead">Um comando do Composer e algumas linhas no <code>.env</code>. O service provider e a facade <code>Sms</code> se registram sozinhos.</p>

## Instale o pacote

```bash
composer require mr-rijal/laravel-sms
```

Depois publique o arquivo de configuração. Você vai precisar dele assim que adicionar um segundo provedor ou mudar os padrões.

```bash
php artisan vendor:publish --tag=sms-config
```

Isso cria o `config/sms.php`. Tudo nele vem de variáveis de ambiente, então a maioria dos projetos nunca edita o arquivo em si.

## Escolha um provedor

Defina o provedor padrão e as credenciais dele. Com a Twilio, por exemplo:

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

A página de cada provedor lista exatamente quais variáveis ele precisa. Se você ainda não escolheu um, comece pela [visão geral dos provedores](/pt/providers/).

::: tip Desenvolvendo localmente?
Deixe o `SMS_PROVIDER` sem valor. O padrão é o driver `log`, que grava cada mensagem no log do Laravel em vez de enviá-la, assim nada chega a um celular de verdade por acidente.
:::

## Confira se está funcionando

Envie uma mensagem de verdade pelo terminal. O caminho no código é exatamente o mesmo que a sua aplicação usa:

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

Se algo estiver errado, o comando mostra o que o provedor respondeu, por exemplo `Failed to send SMS via Twilio (HTTP 401): Authenticate`. Teste um provedor específico com `--provider=sinch` ou um texto seu com `--message="Hello"`.

O `php artisan about` também ganha uma seção **Laravel SMS** que mostra o provedor padrão e se as filas e os webhooks estão ativados.

## Opcional: Amazon SNS

O SDK da AWS é grande, por isso ele só é instalado se você precisar. Se for usar o driver [Amazon SNS](/pt/providers/aws-sns):

```bash
composer require aws/aws-sdk-php
```

## Próximos passos

[Envie sua primeira mensagem →](/pt/guide/quick-start)
