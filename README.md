# MovieStream

Qué hace el proyecto
- MovieStream es una app educativa para gestionar películas, géneros, usuarios e interacciones (vistas/valoraciones). Permite CRUD para `movies` y `users`, y guarda relaciones ligeras entre colecciones usando el driver oficial de MongoDB para Node.js (sin Mongoose).

Cómo correrlo desde cero

Requisitos
- Node.js >= 18
- Un cluster de MongoDB Atlas o una instancia accesible

Pasos

1. Clona el repo y entra al directorio:

```bash
git clone https://github.com/GermanMZtec/Actividad_4_NoSql.git
cd Actividad_4
```

2. Instala dependencias:

```bash
npm install
```

3. Configura variables de entorno (archivo `.env` en la raíz) > variables necesarias:

- `MONGO_URI` — URI completa de conexión a Atlas (ejemplo abajo)
- `MONGO_DB_NAME` — opcional (por defecto `moviestream`)
- `PORT` — opcional (por defecto Render usa 10000)

Ejemplo de `MONGO_URI` (reemplaza `ENCODED_PASSWORD`):


MONGO_URI=mongodb+srv://a00840653_db_user:ENCODED_PASSWORD@servernosql.z4ek0uk.mongodb.net/moviestream?retryWrites=true&w=majority&appName=ServerNoSql


Si la contraseña contiene símbolos, usa `encodeURIComponent` para codificarla antes de pegarla.

4. Ejecuta la app localmente:

```bash
npm start
```

5. Sembrar datos (seed)

El script `seed.js` inserta datos de ejemplo (borra colecciones antes). Ejecuta:

```bash
npm run seed
```

Deploy en Render

- Crea un Web Service en Render usando el repo. En Environment, agrega `MONGO_URI` (exacta) y cualquier otra variable. No subas `.env` al repo.
- Tras guardar, Render desplegará automáticamente. Para poblar datos en producción usa un One‑off Job con:

```bash
npm run seed
```

Stack usado y por qué
- Node.js (ESM) — popular y sencillo para microservicios educativos.
- Express — framework mínimo para rutas y middleware.
- EJS — plantillas server‑side simples para la UI educativa.
- MongoDB (driver oficial) — requisito del proyecto: usar el driver oficial y practicar modelado NoSQL sin Mongoose.
- dotenv — cargar variables locales en desarrollo.

Captura de pantalla

La app está desplegada en: https://actividad-4-nosql.onrender.com



