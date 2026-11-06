# Validación por sección

Fecha: 2026-11-06. Entorno: Windows, Node.js 23.4.0 y npm 10.9.2. Estas versiones registran el entorno utilizado, no una recomendación de despliegue.

Todas las importaciones se comparan con los árboles Git originales. Cada sección tiene un commit propio con atribución y referencia exacta. Este control de integridad es independiente de las pruebas de funcionamiento.

| Sección | Aplicación | Instalación | Lint | Tipos | Build | Paquetes afectados según npm audit |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | First Steps | PASS | PASS | PASS | PASS | 20 |
| 3 | first-steps | REUSED | PASS | PASS | PASS | 20 |
| 4 | my-dashboard | PASS | PASS | PASS | PASS | 20 |
| 5 | my-dashboard | REUSED | PASS | PASS | PASS | 20 |
| 6 | my-dashboard | REUSED | PASS | PASS | PASS | 20 |
| 7 | my-dashboard | PASS | PASS | PASS | PASS | 20 |
| 8 | my-dashboard | REUSED | PASS | PASS | PASS | 20 |
| 9 | admin-todos | PASS | PASS | PASS | NOT_RUN | 20 |
| 10 | admin-todos | PASS | PASS | PASS | NOT_RUN | 18 |
| 11 | admin-todos | PASS | PASS | PASS | NOT_RUN | 18 |
| 12 | admin-todos | PASS | PASS | PASS | NOT_RUN | 20 |
| 13 | admin-todos | PASS | PASS | PASS | NOT_RUN | 25 |
| 14 | teslo-shop | PASS | FAIL | PASS | NOT_RUN | 17 |
| 15 | teslo-shop | PASS | FAIL | PASS | NOT_RUN | 18 |
| 16 | teslo-shop | PASS | FAIL | PASS | NOT_RUN | 19 |
| 17 | teslo-shop | REUSED | PASS | PASS | NOT_RUN | 19 |
| 18 | teslo-shop | REUSED | PASS | PASS | NOT_RUN | 19 |
| 19 | teslo-shop | REUSED | PASS | PASS | NOT_RUN | 19 |
| 20 | teslo-shop | PASS | PASS | PASS | NOT_RUN | 24 |
| 21 | teslo-shop | PASS | PASS | PASS | NOT_RUN | 24 |
| 22 | teslo-shop | REUSED | PASS | PASS | NOT_RUN | 24 |
| 23 | teslo-shop | PASS | PASS | PASS | NOT_RUN | 24 |
| 24 | teslo-shop | PASS | PASS | PASS | NOT_RUN | 26 |
| 25 | teslo-shop | REUSED | PASS | PASS | NOT_RUN | 26 |

`REUSED` indica que el lockfile no cambió y se reutilizó la instalación de la etapa inmediatamente anterior. `NOT_RUN` significa que la prueba no se ejecutó, no que haya pasado. Los detalles de la sección 2 están en `validation/section-02.md`; las demás etapas están en `validation/section-NN.json`. Los errores y tiempos agotados tienen archivos `section-NN-failures.md`.

## Qué se ejecutó

- Dependencias instaladas con `npm ci --ignore-scripts --no-audit --no-fund`; auditoría consultada por separado, sin `audit fix`.
- Lint y TypeScript con `--noEmit --incremental false` por etapa.
- Validación y generación oficial de Prisma cuando existe un esquema, con una URL ficticia en `127.0.0.1:1`. No se ejecutaron consultas, migraciones, semillas ni comandos `db push`.
- Builds para First Steps y Dashboard. Los builds de AdminTodos y Teslo se omiten porque pueden evaluar consultas o rutas destructivas durante la generación.
- Comprobación del HTML generado de First Steps: páginas principales, navegación y enlaces activos.

No se inició un servidor ni se usaron bases de datos, autenticación externa, PayPal o Cloudinary. Los builds de Dashboard pueden consultar la API pública de Pokémon. No se realizaron pruebas interactivas en un navegador ni una certificación de seguridad. Los resultados fallidos y las pruebas omitidas están registrados por etapa.

Los conteos de npm audit incluyen dependencias de desarrollo y transitivas y cambian con los avisos del registro. Representan paquetes afectados, no explotaciones demostradas. Ver `SECURITY_REVIEW.md` para los bloqueos previos a despliegue.
