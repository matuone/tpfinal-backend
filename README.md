# Backend de Ruteando

API REST del proyecto Ruteando.

## Funcionalidades

- autenticacion con JWT (registro y login)
- CRUD de lugares por usuario autenticado
- **categorías de lugares** (Casa, Restaurante, Parque, Museo, Tienda, Playa, Montaña, Otro)
- **geocodificación inversa** - obtener dirección legible desde coordenadas (API Nominatim/OpenStreetMap)
- **filtrado avanzado** de lugares por nombre, categoría, fecha y proximidad
- modulo de soporte con tickets
- endpoint de metricas de operacion
- log de errores HTTP en archivos JSON por fecha
- hardening para despliegue en Render (trust proxy + rate limiting de login)

## Requisitos

- Node.js 20+
- acceso a MongoDB Atlas
- conexion a internet para Nominatim API (geocodificacion)

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

## Configuracion de producción (Render)

- `app.set('trust proxy', 1)` habilitado para procesar correctamente `X-Forwarded-For` detrás de proxy.
- rate limiter de login configurado para evitar bloqueos excesivos en producción.
- recomendación: definir `URI_DB` y `JWT_SECRET` como variables de entorno en Render.

## Scripts utiles

- `npm run dev`: levanta la API en modo desarrollo
- `npm run seed:support`: crea tickets simulados si faltan
- `npm run seed:places`: crea lugares simulados si faltan

## Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Places

- `GET /places` - listar lugares del usuario (con filtrado opcional)
  - Query params:
    - `?name=texto` - filtrar por nombre (case-insensitive)
    - `?category=Restaurante` - filtrar por categoría
    - `?startDate=2024-01-01&endDate=2024-12-31` - rango de fechas
    - `?lat=<num>&lng=<num>&radius=<km>` - filtrar por proximidad en km
- `GET /places/categories/list` - obtener categorías disponibles
- `GET /places/:id`
- `POST /places` - crear lugar (incluye geocodificación inversa automática)
  - Body:
    ```json
    { "name": "string", "lat": number, "lng": number, "category": "string (opcional)" }
    ```
- `PATCH /places/:id` - actualizar lugar
- `DELETE /places/:id`

**Nota:** Los lugares creados incluyen automáticamente:
- `address`: dirección legible obtenida desde coordenadas (ej: "Calle Florida 1000, Buenos Aires")
- `category`: categoría seleccionada

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
- **implementación de categorías y geocodificación inversa** para mejorar UX y estructura de datos

Prompts representativos:

```text
Diseña un módulo de soporte con tickets (bug, mejora, consulta) y un endpoint de métricas para post-lanzamiento.
```

```text
Agrega categorías de lugares y geocodificación inversa usando OpenStreetMap Nominatim API para mostrar dirección legible en lugar de solo coordenadas.
```

Aplicaciones concretas:

- creación de `/support/tickets` y `/support/metrics`
- semilla automática de tickets para la simulación de soporte
- métricas de estado/prioridad y errores recientes para seguimiento
- adición de campo `category` al modelo Place con enum de valores
- adición de campo `address` al modelo Place generado automáticamente
- integración de Nominatim API para reverse geocoding sin autenticación requerida
- filtrado avanzado con búsqueda, categoría, rango de fechas y proximidad

## Cobertura de consigna

### 1. Pre-desarrollo con IA

Aunque este repositorio se enfoca en backend, el producto fue definido con IA antes de la implementación.

Identidad del producto definida:

- Nombre: Ruteando
- Descripción: bitácora mobile-first para registrar lugares reales visitados
- Público objetivo: personas que recorren la ciudad y quieren guardar lugares memorables
- Propuesta de valor: registrar rápidamente lugares físicos y revisarlos luego en un mapa propio

Prompt base usado en pre-desarrollo:

```text
Quiero una idea de app mobile-first para registrar lugares reales visitados por una persona. Necesito nombre, público objetivo, propuesta de valor y una identidad simple.
```

Iteración 1 del prompt:

```text
Quiero una idea de app mobile-first enfocada en exploración urbana. Debe sentirse personal, simple y útil para registrar lugares favoritos desde el celular. Dame nombre, descripción, público objetivo, propuesta de valor y tono de marca. Evita una red social y prioriza una bitácora personal con mapa.
```

Iteración 2 del prompt:

```text
Sobre la propuesta anterior, ajusta la identidad para que sea clara para Argentina: define nombre final, slogan corto, perfil de usuario principal, problema concreto que resuelve en salidas diarias y 3 diferenciales frente a usar notas del celular.
```

### 2. Desarrollo

Requisitos cubiertos por este repositorio:

- backend funcional con API REST
- persistencia con base de datos real MongoDB
- más de 3 endpoints
- documentación del uso de IA para generación de código, debugging y decisiones técnicas

### 3. Post-desarrollo

Requisitos cubiertos por este repositorio:

- sistema de tickets con tipos bug, mejora y consulta
- 5 tickets simulados con prioridad y estado
- métricas de seguimiento de operación

Prompt usado para análisis post-desarrollo:

```text
Con estas métricas de soporte: tickets por estado, tickets por prioridad, errores en 7 días y fallos de login, redacta conclusiones breves sobre estabilidad del producto y próximas mejoras recomendadas.
```

### Entregables y bonus cubiertos

- repositorio backend
- README con descripción, ejecución y uso de IA
- bonus: autenticación JWT
- bonus: base de datos real
- bonus: dashboard simple de métricas
- bonus: deploy productivo en Render