# Revisión y siguiente etapa

## Verificado

- Cuatro aplicaciones independientes; First Steps de las secciones 2 y 3 es una sola línea de evolución.
- Referencias y SHA de cada etapa registrados en `sources.json`.
- Archivos importados comparados byte a byte con su snapshot Git antes de cada commit.
- Sin `.env` real o claves privadas entre los archivos de las referencias solicitadas. Esta comprobación por nombres no sustituye un análisis completo de secretos.
- En la sección 2 se instalaron dependencias sin scripts de instalación y se ejecutaron lint, build y comprobaciones del HTML generado: ver `VALIDATION.md`. No se inició un servidor, ninguna semilla ni contenedores; no se modificaron bases existentes.

## Antes de ejecutar

1. Actualizar Next.js y sus dependencias a versiones soportadas y corregidas, conservando los snapshots como referencia. Estas fuentes usan Next 13.4.4, 13.4.6 y 14.0.1. Existe un aviso oficial que incluye estas líneas entre las afectadas por denegación de servicio en App Router: https://nextjs.org/blog/security-update-2025-12-11 . Consultar los avisos vigentes al actualizar; ese aviso no certifica cuál es la versión más reciente.
2. Proteger o quitar `apps/admin-todos/src/app/api/seed/route.ts`: su GET ejecuta `deleteMany()` y recrea tareas sin autorización. No invocarlo sobre datos que se quieran conservar. La API educativa de tareas tampoco implementa autenticación.
3. Aislar las bases: proponer `127.0.0.1:5433:5432` para AdminTodos y `127.0.0.1:5434:5432` para Teslo; ajustar las plantillas de conexión y evitar nombres globales de contenedor. Ambos Compose originales publican 5432 y AdminTodos define `todos-db`.
4. Usar puertos distintos para las aplicaciones (3001, 3002, 3003 y 3004), con escucha en `127.0.0.1` durante la validación local. No compartir Prisma ni bases entre aplicaciones.
5. Instalar las dependencias de cada aplicación de forma aislada y comprobar lint, tipos y build. Configurar sólo bases de prueba nuevas. El build de Dashboard puede necesitar acceso a la API de Pokémon y las fuentes de Google pueden necesitar red.
6. Validar navegación de First Steps; contador y favoritos de Dashboard; validaciones y operaciones CRUD en una base desechable para AdminTodos; catálogo y modelos/semilla en una base desechable para Teslo. Un checksum de importación no verifica estos comportamientos.

## Publicación pendiente

La identidad del conector GitHub es `Mauro3jo`. La CLI local tiene una credencial inválida; no se intentó renovarla ni se copiaron tokens entre herramientas. Aún falta elegir nombre y visibilidad del repositorio y aclarar permisos de reutilización. No se creó ningún remoto ni se modificó otro repositorio.

La página pública de Udemy muestra el curso y las lecciones de código fuente de las primeras secciones. No se verificaron los adjuntos dentro de la cuenta. Computer Use detuvo la inspección de Edge porque no pudo determinar la URL actual con suficiente confianza; no se intentó eludir esa restricción.
