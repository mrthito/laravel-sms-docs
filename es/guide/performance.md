# Rendimiento

<p class="lead">Enviar un SMS consiste sobre todo en esperar a que el proveedor responda. El paquete aprovecha bien ese tiempo: menos peticiones cuando el proveedor lo permite y peticiones en paralelo cuando no.</p>

## Proveedores con envío masivo: una sola petición {#bulk-providers-one-request}

Estos proveedores aceptan muchos destinatarios en una sola llamada a la API, así que un mensaje para 200 personas es una única petición HTTP:

**Sinch, Plivo, Infobip, ClickSend, Clickatell, Sparrow SMS, Sendchamp, Africa's Talking, BulkSMS, SendPulse** y las plantillas de **MSG91**.

Clickatell admite hasta 100 destinatarios por llamada, así que el paquete divide automáticamente los envíos más grandes en lotes.

## Proveedores de un destinatario por petición: en paralelo {#per-recipient-providers-in-parallel}

**Twilio, Vonage, Telnyx, Bird, Brevo, Bandwidth, WhatsApp, Termii** y **MSG91** con texto libre aceptan un destinatario por petición. En lugar de esperar a que termine cada una antes de empezar la siguiente, el paquete las envía en paralelo con `Http::pool()` de Laravel.

Por defecto se ejecutan diez peticiones a la vez:

```ini [.env]
SMS_HTTP_CONCURRENCY=10
```

Con unos 300 ms por viaje de ida y vuelta al proveedor, 100 destinatarios tardan unos tres segundos en lugar de treinta. Sube el número para lotes grandes si el límite de peticiones de tu proveedor lo permite; bájalo si ves `429 Too Many Requests`.

Amazon SNS publica a través del SDK de AWS, un destinatario cada vez.

## Timeouts {#timeouts}

```ini [.env]
SMS_HTTP_TIMEOUT=30
SMS_HTTP_CONNECT_TIMEOUT=10
```

El timeout de conexión falla rápido cuando no se puede contactar con un proveedor, y eso es lo que más importa en una cadena de [failover](/es/guide/failover): el siguiente proveedor entra en juego a los 10 segundos en lugar de quedarse todo colgado.

## Caché de tokens {#token-caching}

Bandwidth y SendPulse usan OAuth. Sus tokens de acceso se guardan en el almacén de caché de Laravel hasta poco antes de que caduquen, así que la mayoría de los envíos se ahorran ese viaje extra. Si un proveedor rechaza un token antes de tiempo, por ejemplo después de rotar las credenciales, se descarta y el siguiente envío obtiene uno nuevo.

## En tu aplicación {#in-your-application}

- **Encola los envíos que haces durante una petición web.** Con las [colas](/es/guide/queueing), la espera de red sale por completo de la petición.
- **Usa un proveedor con envío masivo para lotes grandes.** Una sola petición escala mucho mejor que cientos.
- **Un mensaje por lote.** Enviar un mismo mensaje a 500 números es mucho más rápido que hacer 500 envíos separados del mismo texto.
