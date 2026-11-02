# Seguridad

<p class="lead">Por SMS viajan códigos de inicio de sesión, datos de pedidos y números de teléfono personales. Estos son los valores predeterminados que los protegen, y los pocos ajustes que dependen de ti.</p>

## Lo que el paquete hace por ti {#what-the-package-does-for-you}

**Las credenciales se quedan donde las pones.** Las API keys y los tokens se leen de tu configuración y solo se envían a su proveedor. Nunca aparecen en mensajes de excepción ni en query strings de URLs, y los tokens OAuth se guardan en caché con una clave hasheada, así que un volcado de la caché no los revela.

**Los errores del proveedor tienen un límite.** Cuando un proveedor explica un rechazo, el paquete conserva solo esa explicación, recortada a 200 caracteres, para que los fallos sean fáciles de depurar. El resto de la respuesta del proveedor nunca se copia en la excepción. Esos mensajes se registran en el log cuando un envío falla. Un proveedor podría repetir en su error parte de tu petición, así que trata los logs de fallos de SMS como información sensible.

**Los números de teléfono aparecen ocultos en los logs.** Las líneas de log del propio paquete muestran `***4567`, nunca el número completo.

**Los mensajes en cola van cifrados.** Cada job de SMS en cola se cifra con tu `APP_KEY`, así que los códigos de inicio de sesión no se pueden leer en Redis, en tu base de datos ni en SQS.

**Los webhooks fallan en cerrado.** Un endpoint de webhook sin secreto configurado rechaza todas las peticiones. Con secreto, las firmas se comparan en tiempo constante. Consulta [Webhooks](/es/guide/webhooks).

**Los datos se validan antes de enviarlos.** Los números mal formados, los mensajes vacíos y los proveedores desconocidos fallan antes de hacer ninguna petición. Las URLs base configurables de los proveedores, como las de Infobip y Termii, deben usar HTTPS.

## Lo que depende de ti {#what-s-up-to-you}

- **Guarda las credenciales en el entorno** o en un gestor de secretos, nunca en el control de versiones. Rótalas si se filtran.
- **Limita la frecuencia de los endpoints que envían SMS.** Un formulario de inicio de sesión que envía un código por SMS es un blanco fácil para el fraude conocido como *SMS pumping*, en el que los atacantes disparan mensajes a números de tarificación especial a tu costa. Limita por número de teléfono y por dirección IP (ver más abajo).
- **Mantén los webhooks desactivados** hasta que los necesites, y sírvelos por HTTPS.
- **No uses el driver `log` en producción.** Escribe en tus archivos de log el texto completo de los mensajes, códigos incluidos.
- **Protege tu `APP_KEY`.** Es la que descifra los mensajes en cola. Cuando la rotes, añade la clave antigua a `APP_PREVIOUS_KEYS` para que los jobs que ya estén en la cola se puedan seguir leyendo.
- **Mantén Laravel y el paquete actualizados.** Laravel 11 ya no recibe parches de seguridad.

## Limitar los códigos de inicio de sesión {#rate-limiting-login-codes}

Con el `RateLimiter` de Laravel, el límite por número son unas pocas líneas:

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

Añade un segundo límite por dirección IP con el middleware `throttle` en la ruta, por ejemplo `->middleware('throttle:10,1')`.

## Informar de una vulnerabilidad {#reporting-a-vulnerability}

Por favor, escribe a [prashantrijal.721@gmail.com](mailto:prashantrijal.721@gmail.com) en lugar de abrir un issue público. Recibirás respuesta lo antes posible, y la corrección se publica antes de hacer públicos los detalles.
