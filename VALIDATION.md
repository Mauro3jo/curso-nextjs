# Validación de la sección 2

Fecha: 2026-11-06. Entorno utilizado: Windows, Node.js 23.4.0 y npm 10.9.2. Esto registra el entorno de la prueba; no prescribe una versión de Node para despliegue.

Sólo se validó `apps/first-steps` en la referencia del instructor `aba9a260f3379fd8a0552b7a54c500ba9f783673`. Las aplicaciones posteriores no forman parte de esta rama.

| Comprobación | Resultado |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | PASS: 352 paquetes instalados; scripts de instalación deshabilitados |
| `npm run lint` | PASS: sin advertencias ni errores de ESLint |
| `npm run build` | PASS: compilación, chequeo de tipos y generación estática |
| `python scripts/check-static-pages.py` desde la raíz | PASS: cuatro páginas, enlaces de navegación y enlace activo correcto |
| `npm audit --json` | FAIL de seguridad: 20 paquetes afectados; 6 moderados, 13 altos y 1 crítico |

La auditoría incluye dependencias de desarrollo y transitivas. Los recuentos son de paquetes afectados según npm en esta consulta, no de vulnerabilidades explotables demostradas en esta aplicación. `next` aparece con severidad crítica. No se ejecutó `npm audit fix` ni se cambiaron versiones.

El build emitió avisos por datos antiguos de Browserslist y por la API de Node `punycode` obsoleta. No impidieron la compilación. La telemetría de Next se deshabilitó durante lint y build.

No se inició un servidor, no se probaron interacciones en un navegador, no se ejecutaron contenedores y no se accedió a bases de datos. La comprobación del HTML generado no sustituye una prueba de navegación e hidratación en navegador. No hubo publicación.

Antes de ejecutar un servidor accesible o desplegar, actualizar las dependencias a versiones soportadas y corregidas y repetir las verificaciones. La siguiente sección del curso es la 3 (Docker y despliegue); conservar la corrección de dependencias como un commit separado si se realiza antes.
