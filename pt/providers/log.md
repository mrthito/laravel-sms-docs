# Log

<p class="lead">O driver padrão. Ele grava cada mensagem no log do Laravel em vez de enviá-la, para você construir e testar na prática as funcionalidades de SMS sem conta em provedor nem celular de verdade.</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # opcional: um canal dedicado do config/logging.php
```

Cada mensagem vira uma entrada `debug`:

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

Os destinatários aparecem mascarados, mas o texto da mensagem vai inteiro para o log, para você conseguir ler os seus códigos durante o desenvolvimento. É justamente por isso que o driver de log **nunca deve ser usado em produção**: os códigos de login iriam parar nos seus arquivos de log.

O `sendNow()` devolve um `SmsResult` com um ID de mensagem `log-…` gerado, então o código que guarda IDs funciona sem mudanças.
