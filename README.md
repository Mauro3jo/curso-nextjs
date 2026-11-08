# Next.js Apps

Cuatro aplicaciones independientes: un sitio con rutas y layouts, un dashboard de Pokémon, un gestor de tareas y una tienda con carrito y pedidos.

| Aplicación | Carpeta | Inicio desde la raíz | Dirección |
| --- | --- | --- | --- |
| First Steps | `apps/first-steps` | `npm run dev:first-steps` | http://127.0.0.1:3001 |
| Dashboard | `apps/my-dashboard` | `npm run dev:my-dashboard` | http://127.0.0.1:3002 |
| AdminTodos | `apps/admin-todos` | `npm run dev:admin-todos` | http://127.0.0.1:3003 |
| Teslo Shop | `apps/teslo-shop` | `npm run dev:teslo-shop` | http://127.0.0.1:3004 |

Cada aplicación conserva sus dependencias y configuración. Dashboard incluye contador, favoritos y persistencia local; AdminTodos añade autenticación y tareas por usuario; Teslo reúne catálogo, direcciones, órdenes y administración de productos.

## Ejecutar

Necesitás Node.js y npm. Instalá las dependencias de la aplicación elegida; por ejemplo:

```sh
npm --prefix apps/first-steps ci --ignore-scripts
npm run dev:first-steps
```

Para otra aplicación, cambiá la carpeta y usá su comando de la tabla.

AdminTodos y Teslo también necesitan PostgreSQL. Desde la carpeta del backend, copiá `.env.template` a `.env`, revisá sus valores y prepará una **base local vacía**:

```sh
cp .env.template .env
docker compose --env-file .env up -d
npx prisma migrate deploy
npx prisma generate
```

AdminTodos usa el puerto 5433 y Teslo el 5434, con directorios de datos separados. Revisá `DATABASE_URL` antes de migrar. Las semillas reemplazan datos y no forman parte del arranque; la ruta HTTP de semilla de AdminTodos está deshabilitada.

PayPal y Cloudinary requieren sus variables de entorno para habilitar esas integraciones. La validación de PayPal exige también `PAYPAL_MERCHANT_ID`. Guardá las credenciales únicamente en `.env`.

## Comprobar

Con las dependencias y los clientes Prisma de ambos backends preparados:

```sh
npm test
npm run lint:admin-todos
npm run lint:teslo-shop
```

Los resultados y las pruebas pendientes están en [VALIDATION.md](VALIDATION.md). Hay avisos de dependencias y límites de seguridad documentados en [SECURITY_REVIEW.md](SECURITY_REVIEW.md); revisalos antes de exponer las aplicaciones.

## Créditos

Basado en los ejemplos de Fernando Herrera y DevTalles. [SOURCES.md](SOURCES.md) conserva los repositorios, las referencias por sección y la atribución del material original. Las correcciones locales tienen commits separados.
