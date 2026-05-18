REFLECTION

1) Volviendo a empezar

Si pudiera rediseñar el modelo desde cero haría varias cosas de forma distinta:

- Consistencia en la configuración: al inicio usé `MONGO_URI` en el código pero en un momento puse `MONGODB_URI` en `.env`; ese error me costó tiempo al correr `seed.js`. Hoy colocaría una única fuente de verdad para variables (`config.js`) y validación temprana al arranque para fallar con mensajes claros.
- Decidiría si normalizar o denormalizar según consultas esperadas: opté por colección `genres` y almacenar `ObjectId` en `movies`. Esto funciona pero obliga a resolver nombres en la capa de aplicación (hice mapeos manuales). Si la app necesitara mostrar siempre el nombre del género, habría embebido `name` dentro de `movies` para lecturas más rápidas.
- Información que faltaba: no anticipé cuánto tiempo consumiría el manejo de conexiones (dotenv vs Render env) y la necesidad de codificar la contraseña para URLs.

2) La conversación con tu modelo (operaciones incómodas)

Operación: listar películas con nombres de géneros.

- Lo que hice: `movies` almacena un array de `ObjectId` de `genres`. Para renderizar la lista en la UI, mi servicio `movieService.listMovies()` consulta `movies`, luego recupera `genres` y mapea los ids a nombres en memoria. Eso fue dos queries en vez de un JOIN.

Otro ejemplo: las interacciones (logs de vistas/ratings) son muy cómodas en NoSQL (alta tasa de escrituras, esquema flexible). Para algunas consultas analíticas terminé usando agregaciones sobre `interactions`, que funcionan bien pero se vuelven costosas sin índices.

3) ¿Realmente NoSQL fue mejor para MovieStream?

Respuesta honesta: depende.

- Ventajas que noté al usar MongoDB:
  - Modelo flexible para `actors` (listado embebido con `name` y `character`).
  - Escrituras de `interactions` sencillas y escalables.
  

- Desventajas:
  - Consultas relacionales (ej. mostrar películas con datos de otra colección) requieren mas codigo.
  - Consistencia entre colecciones (p.ej. si renombrara un género debería actualizar documentos o aceptar inconsistencia si el nombre se embebe).

Para MovieStream en su forma actual (app educativa, UI simple, datasets modestos), NoSQL fue una buena opción por la rapidez de prototipado y el manejo natural de arrays (actors). Si el producto hubiera exigido reportes relacionales complejos y integridad referencial, un modelo relacional habría sido más sencillo.

Conclusión: para este proyecto NoSQL es adecuado; sin embargo, con lo aprendido hoy optimizaría el modelado para las lecturas más comunes (por ejemplo embebiendo campos o haciendo uniones en la base de datos cuando convenga), añadiría índices y validación, y centralizaría la configuración para evitar errores de despliegue.
