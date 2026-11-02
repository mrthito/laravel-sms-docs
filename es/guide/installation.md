# Instalación

<p class="lead">Un comando de Composer y unas pocas líneas en el <code>.env</code>. El service provider y la facade <code>Sms</code> se registran solos.</p>

## Instala el paquete {#install-the-package}

```bash
composer require mr-rijal/laravel-sms
```

Después publica el archivo de configuración. Lo vas a necesitar en cuanto añadas un segundo proveedor o cambies los valores predeterminados.

```bash
php artisan vendor:publish --tag=sms-config
```

Esto crea `config/sms.php`. Todo lo que contiene se lee de variables de entorno, así que la mayoría de los proyectos nunca tocan el archivo.

## Elige un proveedor {#choose-a-provider}

Define tu proveedor predeterminado y sus credenciales. Con Twilio, por ejemplo:

```ini [.env]
SMS_PROVIDER=twilio

TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your-auth-token
TWILIO_FROM=+15550000000
```

La página de cada proveedor indica exactamente qué variables necesita. Si todavía no has elegido uno, empieza por la [guía de proveedores](/es/providers/).

::: tip ¿Trabajas en local?
No definas `SMS_PROVIDER`. El valor predeterminado es el driver `log`, que escribe cada mensaje en el log de Laravel en lugar de enviarlo, así que nada llega por accidente a un teléfono real.
:::

## Comprueba que funciona {#check-that-it-works}

Envía un mensaje real desde la terminal. El comando recorre exactamente el mismo código que tu aplicación:

```bash
php artisan sms:test +15551234567
```

```text
   INFO  Sent via [twilio] (message ID SM9f1c2e…).
```

Si algo falla, el comando te muestra lo que respondió el proveedor, por ejemplo `Failed to send SMS via Twilio (HTTP 401): Authenticate`. Prueba un proveedor concreto con `--provider=sinch` o tu propio texto con `--message="Hello"`.

Además, `php artisan about` incorpora una sección **Laravel SMS** que muestra tu proveedor predeterminado y si las colas y los webhooks están activados.

## Opcional: Amazon SNS {#optional-amazon-sns}

El SDK de AWS es grande, así que no se instala a menos que lo necesites. Si vas a usar el driver de [Amazon SNS](/es/providers/aws-sns):

```bash
composer require aws/aws-sdk-php
```

## Siguientes pasos {#next-steps}

[Envía tu primer mensaje →](/es/guide/quick-start)
