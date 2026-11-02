# Funcionalidades

<p class="lead">Todo lo que hace el paquete, en una sola página. Cada punto enlaza con la parte de la guía que lo explica.</p>

## Envío {#sending}

| | |
|---|---|
| **Una API, veinte proveedores** | Twilio, Vonage, Sinch, Bird, Plivo, Telnyx, Infobip, ClickSend, Clickatell, Brevo, Bandwidth, SendPulse, Amazon SNS, WhatsApp, MSG91, Sparrow SMS, Termii, Sendchamp, Africa's Talking y BulkSMS. [Proveedores →](/es/providers/) |
| **Builder fluido** | `Sms::to()->message()->send()`, con un mensaje nuevo en cada llamada. [Redactar mensajes →](/es/guide/sending) |
| **Limpieza de números** | Se quitan espacios, guiones, puntos y paréntesis, se descartan los duplicados y los números no válidos se rechazan antes de enviar. [Destinatarios →](/es/guide/sending#recipients) |
| **Cambio de remitente** | `->from('ACME')` en cada mensaje. [Remitente →](/es/guide/sending#sender) |
| **Plantillas** | Flows de MSG91 (DLT), plantillas de WhatsApp y de Brevo, con texto de respaldo para los demás proveedores. [Plantillas →](/es/guide/templates) |
| **Macros** | Ponle nombre a tus mensajes habituales: `Sms::sendOtp($phone, $code)`. [Macros →](/es/guide/sending#macros) |

## Fiabilidad {#reliability}

| | |
|---|---|
| **Resultados con IDs de mensaje** | Cada envío devuelve los IDs del proveedor para cada destinatario aceptado. [Resultados →](/es/guide/results) |
| **Fallos precisos** | `DeliveryException` enumera los destinatarios que fallaron y los que sí salieron. [Fallos parciales →](/es/guide/results#partial-failures) |
| **Failover** | Encadena proveedores; solo pasan al siguiente los destinatarios rechazados, así que nadie recibe el mensaje dos veces. [Failover →](/es/guide/failover) |
| **Balanceo de carga** | Reparte los mensajes entre un grupo de proveedores. [Balanceo de carga →](/es/guide/failover#load-balancing) |
| **Colas** | `sendLater()`, `sendLaterAt()`, un job cifrado por destinatario, con reintentos. [Colas →](/es/guide/queueing) |

## Velocidad {#speed}

| | |
|---|---|
| **Peticiones masivas** | Los proveedores con endpoint de envío masivo reciben a todos los destinatarios en una sola llamada. [Rendimiento →](/es/guide/performance) |
| **Peticiones en paralelo** | Con el resto, las peticiones van en paralelo, diez a la vez por defecto. [Rendimiento →](/es/guide/performance#per-recipient-providers-in-parallel) |
| **Caché de tokens** | Los tokens OAuth se reutilizan hasta que caducan. [Caché de tokens →](/es/guide/performance#token-caching) |

## Integración con Laravel {#laravel-integration}

| | |
|---|---|
| **Canal de notificaciones** | `via()` devuelve `'sms'` y `toSms()` devuelve el mensaje. [Notificaciones →](/es/guide/notifications) |
| **Eventos** | `SmsSending` (cancelable), `SmsSent`, `SmsFailed` y `SmsWebhookReceived`. Laravel encuentra tus clases listener por sí solo. [Eventos →](/es/guide/events) |
| **Webhooks** | Informes de entrega firmados para WhatsApp, Termii, Sendchamp, Africa's Talking y BulkSMS. [Webhooks →](/es/guide/webhooks) |
| **Artisan** | `php artisan sms:test` y una sección en `php artisan about`. [Artisan →](/es/reference/artisan) |
| **Seguro con Octane y colas** | No se comparte estado entre envíos ni entre peticiones. |

## Pruebas {#testing}

| | |
|---|---|
| **`Sms::fake()`** | Registra los mensajes en lugar de enviarlos, con aserciones fáciles de leer. [Pruebas →](/es/guide/testing) |
| **`Http::fake()`** | Todos los drivers HTTP funcionan sobre el cliente HTTP de Laravel. [Probar un driver →](/es/guide/testing#testing-a-driver) |

## Seguridad {#security}

| | |
|---|---|
| **Webhooks cerrados por defecto** | Las peticiones sin firma o que no se pueden verificar se rechazan. [Webhooks →](/es/guide/webhooks) |
| **Payloads de cola cifrados** | Los códigos y los números se cifran con tu `APP_KEY`. [Colas →](/es/guide/queueing#encrypted-at-rest) |
| **Credenciales bien guardadas** | Ningún secreto en mensajes de excepción, URLs ni claves de caché; los números aparecen enmascarados en los logs. [Seguridad →](/es/guide/security) |

## Extensión {#extending}

| | |
|---|---|
| **Drivers propios** | Extiende `HttpDriver` y describe solo la API del proveedor. [Drivers propios →](/es/guide/custom-drivers) |
| **Registro en tiempo de ejecución** | `Sms::extend('acme', …)` desde un service provider. [Registrar en tiempo de ejecución →](/es/guide/custom-drivers#registering-at-runtime) |
