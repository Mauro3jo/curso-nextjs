# Seguridad y límites

## Controles añadidos el 2026-11-08

- AdminTodos devuelve 404 en la antigua ruta HTTP de semilla. El listado de tareas exige sesión, filtra por propietario y limita la paginación a un máximo de 100 registros.
- Las acciones de direcciones de Teslo exigen que el usuario solicitado coincida con la sesión.
- Crear o actualizar productos y eliminar sus imágenes requiere rol de administrador. La eliminación comprueba además que la URL corresponda al registro de imagen.
- Asociar una transacción a una orden exige identificadores válidos, sesión, propiedad y una orden todavía impaga. La actualización mantiene esas condiciones en la consulta a Prisma.
- Verificar un pago exige una orden vinculada al usuario y a la transacción. Se comprueban respuesta HTTP satisfactoria, estado completado, factura, comercio, moneda USD, importe y captura final. `PAYPAL_MERCHANT_ID` debe estar configurado; su ausencia impide confirmar el pago.
- La confirmación es condicional y repetir una verificación válida no cambia la fecha de un pago ya registrado. Se retiró el registro de las respuestas completas del proveedor.

Las 37 pruebas ejecutan los handlers y las acciones TypeScript con sesiones, persistencia y transportes simulados. Cubren accesos anónimos, otros propietarios, roles, respuestas de pago incompatibles y caminos autorizados. No realizan operaciones contra PayPal, Cloudinary o una base real.

## Pendiente antes de desplegar

- Las dependencias conservan versiones históricas con avisos de seguridad. No se realizó una migración de Next.js o React ni se certificó la ausencia de vulnerabilidades.
- La carga de imágenes requiere límites de tamaño, cantidad y tipo de archivo. El control de administrador añadido no sustituye esas validaciones.
- Faltan pruebas de integración con PostgreSQL y autenticación reales, pruebas visuales y comprobaciones de los proveedores externos. Los controles probados de forma aislada no equivalen a una auditoría completa.

## Configuración local

PostgreSQL escucha en loopback, en 5433 para AdminTodos y 5434 para Teslo, con directorios de datos separados. Los builds generan y compilan sin ejecutar migraciones. `prisma:deploy` se conserva como operación explícita; las semillas se revisan antes de usarlas sobre una base desechable.

Los builds de cierre se ejecutaron con variables ficticias y una URL de base local sin servicio, sin `.env` real. No se iniciaron servidores ni contenedores, no se ejecutaron migraciones o semillas y no se realizaron pagos.

El historial conserva los snapshots originales, incluidos sus fallos educativos. Los controles anteriores corresponden al estado actual de `main`. La atribución y la información de las fuentes se mantienen en [SOURCES.md](SOURCES.md).

Referencias: [seguridad de datos y Server Actions en Next.js](https://nextjs.org/docs/app/guides/data-security), [tratamiento de filtros undefined en Prisma](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined).
