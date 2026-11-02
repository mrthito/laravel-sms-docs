# Cómo elegir proveedor

<p class="lead">Todos los proveedores funcionan con la misma API, así que esta elección tiene que ver con precio, cobertura y trámites, no con código. Puedes cambiar de idea más adelante editando una sola línea del <code>.env</code>.</p>

## De un vistazo {#at-a-glance}

| Proveedor | Clave | Cobertura | Envío | Plantillas | Webhooks |
|---|---|---|---|---|---|
| [Twilio](/es/providers/twilio) | `twilio` | Global | En paralelo |  |  |
| [Vonage](/es/providers/vonage) | `vonage` | Global | En paralelo |  |  |
| [Sinch](/es/providers/sinch) | `sinch` | Global | Masivo |  |  |
| [Bird](/es/providers/bird) | `bird` | Global | En paralelo |  |  |
| [Plivo](/es/providers/plivo) | `plivo` | Global | Masivo |  |  |
| [Telnyx](/es/providers/telnyx) | `telnyx` | Global | En paralelo |  |  |
| [Infobip](/es/providers/infobip) | `infobip` | Global | Masivo |  |  |
| [ClickSend](/es/providers/clicksend) | `clicksend` | Global | Masivo |  |  |
| [Clickatell](/es/providers/clickatell) | `clickatell` | Global | Masivo |  |  |
| [Brevo](/es/providers/brevo) | `brevo` | Global | En paralelo | ✓ |  |
| [Bandwidth](/es/providers/bandwidth) | `bandwidth` | Estados Unidos y Canadá | En paralelo |  |  |
| [SendPulse](/es/providers/sendpulse) | `sendpulse` | Global | Masivo |  |  |
| [Amazon SNS](/es/providers/aws-sns) | `aws_sns` | Global | SDK |  |  |
| [WhatsApp](/es/providers/whatsapp) | `whatsapp` | Global | En paralelo | ✓ | ✓ |
| [MSG91](/es/providers/msg91) | `msg91` | India | Ambos | ✓ |  |
| [Sparrow SMS](/es/providers/sparrow) | `sparrow` | Nepal | Masivo |  |  |
| [Termii](/es/providers/termii) | `termii` | Nigeria y África | En paralelo |  | ✓ |
| [Sendchamp](/es/providers/sendchamp) | `sendchamp` | Nigeria y África | Masivo |  | ✓ |
| [Africa's Talking](/es/providers/africastalking) | `africastalking` | Toda África | Masivo |  | ✓ |
| [BulkSMS](/es/providers/bulksms) | `bulksms` | Global, con más fuerza en el sur de África | Masivo |  | ✓ |

Los proveedores con envío **masivo** reciben a todos los destinatarios en una sola petición. Los proveedores **en paralelo** reciben un destinatario por petición, y el paquete envía esas peticiones [a la vez](/es/guide/performance).

## Cómo decidir {#picking-one}

**Empieza por dónde están tus usuarios.** Los proveedores globales llegan a casi todos los países, pero las pasarelas locales suelen ser más baratas y fiables en su propio mercado. En Nigeria, [Termii](/es/providers/termii) y [Sendchamp](/es/providers/sendchamp) esquivan las restricciones de Do-Not-Disturb que bloquean a muchos remitentes internacionales. En India, [MSG91](/es/providers/msg91) se encarga del registro DLT. En Nepal, [Sparrow SMS](/es/providers/sparrow) se conecta directamente con los dos operadores.

**Después piensa en qué vas a enviar.**

- *Los códigos de inicio de sesión y las alertas* necesitan una entrega rápida y fiable más que precios bajos. Twilio, Sinch, Vonage e Infobip tienen las conexiones directas con operadores más amplias.
- *Los anuncios a mucha gente* salen mejor con proveedores de envío masivo, que envían a todos en una sola petición: Sinch, Plivo, Infobip, ClickSend, Clickatell.
- *Las conversaciones* en las que los clientes responden encajan en [WhatsApp](/es/providers/whatsapp) o en un proveedor con números bidireccionales y webhooks de entrega.

**Y en lo que ya tienes.** ¿Ya estás en AWS? [Amazon SNS](/es/providers/aws-sns) se factura en tu cuenta actual. ¿Envías correos con Brevo? Sus [SMS](/es/providers/brevo) comparten el mismo panel.

::: tip No dependas de una sola red
Elijas el que elijas, añade un segundo proveedor detrás con [failover](/es/guide/failover). Las caídas son raras, pero cuando ocurren, tus códigos de inicio de sesión siguen llegando.
:::

## Remitentes y registro {#sender-ids-and-registration}

Hoy en día, la mayoría de los países exigen algún tipo de registro antes de enviar SMS de aplicación a persona (A2P) a gran escala:

- **Estados Unidos:** registro de marca y campaña 10DLC, o un número gratuito (toll-free) verificado.
- **India:** registro DLT de tu remitente y de cada plantilla de mensaje.
- **Muchos otros** exigen registrar de antemano los remitentes alfanuméricos.

Tu proveedor te guía en el proceso. Cuenta con unos días antes del lanzamiento.

## Para desarrollo y pruebas {#for-development-and-tests}

| Driver | Para qué sirve |
|---|---|
| [`log`](/es/providers/log) | Desarrollo local. Escribe cada mensaje en el log de Laravel en lugar de enviarlo. |
| [`fake`](/es/guide/testing) | Pruebas automatizadas. Usa `Sms::fake()` para las aserciones. |
| [`failover`](/es/guide/failover) | Encadenar proveedores reales para ganar resiliencia. |
