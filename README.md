# Next.js: proyectos del curso

Ejercicios del curso de Next.js de Fernando Herrera y DevTalles, organizados por secciones y aplicaciones independientes.

## Sección actual: 2

`apps/first-steps` contiene las primeras rutas, layouts anidados, navegación y enlaces activos. El código de referencia procede de `Klerith/next-first-steps-dev`, rama `fin-seccion-2`; su commit exacto está en `sources.json`.

Cada etapa se importa y verifica por separado antes de continuar. Los commits identifican el material del instructor y los cambios de esta colección.

## Validar esta etapa

Desde `apps/first-steps`:

```sh
npm ci --ignore-scripts
npm run lint
npm run build
```

Estas versiones educativas usan Next.js 13.4.4 y requieren revisión de seguridad antes de ejecutarse en un servidor accesible o desplegarse. El build puede necesitar red para descargar la fuente Inter. Consultar `REVIEW.md` para los límites y requisitos de las etapas posteriores.

Resultados de esta etapa: [VALIDATION.md](VALIDATION.md). El chequeo de las páginas generadas se ejecuta desde la raíz con `python scripts/check-static-pages.py` después del build.

## Recorrido previsto

| Etapas | Aplicación | Contenido |
| --- | --- | --- |
| 2–3 | First Steps | Rutas, layouts y preparación para Docker |
| 4–8 | My Dashboard | Pokémon, renderizado, Redux y favoritos |
| 9 | AdminTodos | API de tareas con Prisma |
| 14–16 | Teslo Shop | Pantallas de tienda y PostgreSQL |

Las etapas posteriores aún no forman parte de esta rama. Cada aplicación conservará sus dependencias, lockfile y configuración, sin compartir bases de datos.

## Fuentes

Los repositorios y la atribución se detallan en [SOURCES.md](SOURCES.md). Los commits de importación tienen fechas actuales y no representan la recuperación del historial de otro equipo. La publicación está pendiente de aclarar los permisos de redistribución del material y elegir la visibilidad.
