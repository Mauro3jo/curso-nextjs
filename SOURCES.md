# Fuentes y atribución

Curso: [Next.js: El framework de React para producción](https://www.udemy.com/course/nextjs-fh/), de Fernando Herrera y DevTalles.

| Aplicación | Repositorio original | Referencias utilizadas |
| --- | --- | --- |
| First Steps inicial | https://github.com/Klerith/next-first-steps-dev | `fin-seccion-2` |
| First Steps continuación | https://github.com/Klerith/next-first-steps | `fin-seccion-3` |
| Dashboard | https://github.com/Klerith/next-my-dashboard | Secciones 4–8; excepción histórica para la 6 |
| AdminTodos | https://github.com/Klerith/next-admin-todos | Secciones 9–13; variante estable para la 11 |
| Teslo Shop | https://github.com/DevTalles-corp/next-teslo-shop | Secciones 14–24 y `main` posterior a la integración de la 25 |

`sources.json` conserva el SHA exacto de cada etapa y los mensajes de commit repiten la fuente. Los commits de esta colección son importaciones con fechas actuales; no atribuyen como original del usuario el código del instructor ni simulan recuperar su historial perdido.

## Selección de referencias

- Dashboard `fin-seccion-6` y `fin-seccion-06` apuntan actualmente a una actualización posterior de dependencias (`ec656ef`). Se utilizó el commit histórico `a00d14c` ("Fin sección 6"), antecesor de la sección 7.
- AdminTodos dispone de `fin-seccion-11` experimental y `fin-seccion-11-stable`. Se utilizó la variante estable, compatible con el recorrido actualizado de Next 14, registrando su SHA exacto.
- Teslo no conserva una rama final llamada `fin-seccion-25`, pero `main` contiene la integración `b4db4ce` ("Merge branch 'fin-seccion-25'") y correcciones posteriores. Se importó su snapshot `1cfdcf25a88ac49f95fe8dddd1fa8214aaa5d2ae` como esa etapa final disponible. `fin-seccion-25-dev` sigue apuntando a la misma referencia que la 24 y no se cuenta como una nueva etapa terminada.
- No se incluyeron como cierres las ramas `dev`, ni se inventaron snapshots para las secciones 26 y 27 del temario actual.

## Licencia y atribución

No se encontró un archivo LICENSE, LICENCE, COPYING o NOTICE en las referencias ni en el historial descargado de esos nombres. Se mantienen la atribución y los enlaces originales; no se asigna una licencia nueva al código del instructor ni se afirma que sus derechos se hayan transferido. Consultar las condiciones de las fuentes originales antes de reutilizar este material en otros proyectos.

La cuenta GitHub verificada es `Mauro3jo` y el destino es `Mauro3jo/curso-nextjs`, siguiendo la organización pública de sus otros repositorios de cursos. La CLI funciona con acceso de red habilitado; el diagnóstico anterior de credencial inválida ocurrió bajo restricción de red y no se confirmó. No se renovaron ni copiaron tokens.

La página pública de Udemy confirmó el curso y parte de su temario. Los adjuntos de la cuenta siguen sin verificar: Computer Use detuvo Edge porque no pudo determinar la URL actual con suficiente confianza. No se eludió la restricción.

## Ajustes propios posteriores a las importaciones

Un commit separado agrega comandos desde la raíz, puertos HTTP distintos, PostgreSQL en loopback con puertos y directorios independientes y plantillas de conexión actualizadas. También elimina las migraciones automáticas del build final de Teslo. Los commits de importación anteriores siguen coincidiendo exactamente con las fuentes; estos ajustes de integración se identifican aparte.
