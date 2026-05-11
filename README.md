# Backend de Ruteando

API REST del proyecto Ruteando.

## Funcionalidades

- autenticacion con JWT (registro y login)
- CRUD de lugares por usuario autenticado
- modulo de soporte con tickets
- endpoint de metricas de operacion
- log de errores HTTP en archivos JSON por fecha

## Requisitos

- Node.js 20+
- acceso a MongoDB Atlas

## Configuracion

Crear `backend/.env` desde `backend/.env.example`.

Variables recomendadas:

```env
URI_DB=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ruteando?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tu_clave
```

Variables opcionales para semillas:

```env
SEED_API_URL=http://localhost:3000
SEED_USER_EMAIL=demo.ruteando@example.com
SEED_USER_PASSWORD=Ruteando123!
```

## Ejecucion

```bash
cd backend
npm install
npm run dev
```

Servidor: `http://localhost:3000`

En Render, el servicio usa automáticamente `PORT` del entorno.

## Scripts utiles

- `npm run dev`: levanta la API en modo desarrollo
- `npm run seed:support`: crea tickets simulados si faltan
- `npm run seed:places`: crea lugares simulados si faltan

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Places

- `GET /places`
- `GET /places/:id`
- `POST /places`
- `PATCH /places/:id`
- `DELETE /places/:id`

### Support

- `GET /support/tickets`
- `POST /support/tickets`
- `PATCH /support/tickets/:id`
- `GET /support/metrics`

## Uso de IA en backend

Prompts aplicados en desarrollo:

- diseño de endpoints para post-desarrollo con tickets y métricas
- propuesta de estructura de controladores y rutas para mantener separación por dominio
- apoyo en debugging de filtros por usuario y consistencia del CRUD

Prompt representativo:

```text
Sobre una API Express con autenticación JWT y CRUD de lugares, diseña un módulo de soporte con tickets (bug, mejora, consulta) y un endpoint de métricas para post-lanzamiento.
```

Aplicación concreta:

- creación de `/support/tickets` y `/support/metrics`
- semilla automática de tickets para la simulación de soporte
- métricas de estado/prioridad y errores recientes para seguimiento