# Segurança

<p class="lead">SMS carrega códigos de login, detalhes de pedidos e números de telefone pessoais. Estes são os padrões que protegem esses dados e as poucas configurações que ficam por sua conta.</p>

## O que o pacote faz por você

**As credenciais ficam onde você as colocou.** Chaves de API e tokens são lidos da sua configuração e enviados só para o respectivo provedor. Eles nunca aparecem em mensagens de exceção nem em query strings de URL, e os tokens OAuth ficam no cache sob uma chave com hash, então um dump do cache não os revela.

**Os erros dos provedores têm limite.** Quando um provedor explica uma recusa, o pacote guarda essa mensagem, cortada em 200 caracteres, para facilitar a depuração. Ele nunca inclui o corpo bruto da resposta. Essas mensagens vão para o log quando um envio falha. Um provedor pode repetir parte da sua requisição no erro, então trate os logs de falha de SMS como dados sensíveis.

**Os números de telefone aparecem mascarados nos logs.** As linhas de log do próprio pacote mostram `***4567`, nunca o número completo.

**As mensagens na fila são criptografadas.** Todo job de SMS na fila é criptografado com a sua `APP_KEY`, então os códigos de login não ficam legíveis no Redis, no seu banco de dados ou no SQS.

**Os webhooks falham fechados.** Um endpoint de webhook sem segredo configurado recusa todas as requisições. Com um segredo, as assinaturas são comparadas em tempo constante. Veja [Webhooks](/pt/guide/webhooks).

**A entrada é validada antes do envio.** Números malformados, mensagens vazias e provedores desconhecidos falham antes de qualquer requisição. As URLs base de provedores que podem ser configuradas, como as da Infobip e da Termii, precisam usar HTTPS.

## O que fica por sua conta

- **Guarde as credenciais no ambiente** ou em um gerenciador de segredos, nunca no controle de versão. Troque-as se vazarem.
- **Aplique rate limit nos endpoints que enviam SMS.** Um formulário de login que manda um código por SMS é um alvo fácil para a fraude de "SMS pumping", em que atacantes disparam mensagens para números premium e a conta fica com você. Limite por número de telefone e por endereço IP (veja abaixo).
- **Deixe os webhooks desligados** até precisar deles, e sirva-os por HTTPS.
- **Não use o driver `log` em produção.** Ele grava o texto completo das mensagens, incluindo qualquer código, nos seus arquivos de log.
- **Proteja a sua `APP_KEY`.** É ela que descriptografa as mensagens na fila. Quando você trocá-la, liste a chave antiga em `APP_PREVIOUS_KEYS` para que os jobs que já estão na fila ainda possam ser lidos.
- **Mantenha o Laravel e o pacote atualizados.** O Laravel 11 não recebe mais correções de segurança.

## Rate limit para códigos de login {#rate-limiting-login-codes}

Com o `RateLimiter` do Laravel, o limite por número cabe em poucas linhas:

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

Adicione um segundo limite por endereço IP com o middleware `throttle` na rota, por exemplo `->middleware('throttle:10,1')`.

## Reportando uma vulnerabilidade

Mande um e-mail para [prashantrijal.721@gmail.com](mailto:prashantrijal.721@gmail.com) em vez de abrir uma issue pública. Você vai receber uma resposta o quanto antes, e a correção é lançada antes de os detalhes se tornarem públicos.
