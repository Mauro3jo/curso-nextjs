# Next.js: proyectos del curso

Ejercicios de Next.js del curso de Fernando Herrera y DevTalles, organizados en cuatro aplicaciones independientes y commits por sección.

| Aplicación | Secciones disponibles | Contenido |
| --- | --- | --- |
| `apps/first-steps` | 2–3 | Rutas, layouts, navegación y Docker |
| `apps/my-dashboard` | 4–8 | Pokémon, renderizado, Redux y favoritos |
| `apps/admin-todos` | 9–13 | API, Prisma, Server Actions, cookies y autenticación |
| `apps/teslo-shop` | 14–25 | Catálogo, carrito, usuarios, pedidos, pagos y administración |

Cada aplicación conserva sus dependencias, lockfile y configuración. First Steps de las secciones 2 y 3 es una misma aplicación en dos etapas. Las cuatro aplicaciones comparten el repositorio, pero no una base de datos ni una instalación de dependencias.

## Recorrido

Cada commit de importación identifica la sección, el repositorio original y su SHA. `sources.json` permite localizar el punto de control exacto. Los commits registran importaciones y validaciones actuales; no reproducen fechas ni autoría de trabajo perdido en otro equipo.

Se incorporaron las referencias disponibles de las secciones 2–24 y el `main` de Teslo posterior a la integración identificada como sección 25. No hay fuentes verificadas para las secciones 26 y 27 del temario actual. La introducción no tiene un proyecto independiente.

## Validación

Consultar [VALIDATION.md](VALIDATION.md) para los resultados por sección y [SECURITY_REVIEW.md](SECURITY_REVIEW.md) antes de ejecutar aplicaciones. Hay diferencias entre importar correctamente una etapa, pasar sus comprobaciones y poder desplegarla de forma segura.

Las dependencias históricas tienen avisos de seguridad. No iniciar servidores accesibles ni desplegar estos snapshots sin corregir dependencias y autorización. Los builds con base de datos, los pagos y las semillas no se ejecutaron durante esta preparación.

Para revisar First Steps, desde `apps/first-steps`:

```sh
npm ci --ignore-scripts
npm run lint
npm run build
```

Después del build, desde la raíz: `python scripts/check-static-pages.py`. El build puede descargar la fuente Inter. Los proyectos con Prisma necesitan preparación adicional; ver la revisión y los resultados por etapa antes de ejecutarlos.

## Fuentes

Código de referencia de Fernando Herrera / DevTalles. Repositorios y decisiones de selección en [SOURCES.md](SOURCES.md). Se conservan los README originales de cada aplicación. No se asigna una nueva licencia al código del instructor.

La publicación está pendiente de aclarar el permiso de redistribución y elegir nombre y visibilidad del repositorio. No hay remoto configurado ni contenido enviado a GitHub.

## Configuración local

Una vez resueltos los bloqueos de seguridad y preparadas las dependencias de cada aplicación, los comandos de la raíz usan puertos separados y escucha en loopback:

| Aplicación | Comando | Puerto HTTP | PostgreSQL local |
| --- | --- | --- | --- |
| First Steps | `npm run dev:first-steps` | 3001 | No utiliza |
| Dashboard | `npm run dev:my-dashboard` | 3002 | No utiliza |
| AdminTodos | `npm run dev:admin-todos` | 3003 | 5433 |
| Teslo | `npm run dev:teslo-shop` | 3004 | 5434 |

Los Compose y las plantillas de conexión coinciden en esos puertos. Cada base usa su propio directorio de datos. El build final de Teslo genera Prisma y compila; las migraciones quedan separadas en `prisma:deploy`. La configuración se validó con `docker compose config`; no se iniciaron servicios ni se ejecutaron migraciones. Ver `validation/local-configuration.json`.
