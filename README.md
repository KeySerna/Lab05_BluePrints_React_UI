# Blueprints React Lab
# Alumnos: Keyla Y. Serna Illescas - Esteban Valente Arenas

Cliente SPA en React para el sistema de Blueprints, construido con **React + Vite**, **Redux Toolkit**, **Axios** (con interceptores JWT), **React Router** y pruebas con **Vitest + Testing Library**.

Moderniza el cliente clásico HTML/JS de los Labs 3-4, consumiendo las mismas APIs REST protegidas con JWT.

## Requisitos previos

- Backend de Blueprints de los Labs 3 y 4 corriendo (APIs + seguridad), **o** usar el modo mock incluido (no requiere backend).
- Node.js 18+ y npm.

## Cómo arrancar

```bash
npm install
cp .env.example .env
# edita .env con la URL de tu backend si vas a usar el API real
npm run dev
```

Abre http://localhost:5173

## Variables de entorno

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` → usa `apiMock.js` (datos de prueba en memoria, sin backend).
- `VITE_USE_MOCK=false` → usa `apiRemote.js` (Axios contra `VITE_API_BASE_URL`, con JWT).

El cambio de fuente de datos es de una sola línea: `src/services/blueprintsService.js` importa uno u otro servicio según esta variable.

## Login (modo mock)

Usuario: `admin` — Contraseña: `admin123`

## Estructura

```
src/
├─ components/       BlueprintCanvas, BlueprintsTable, AuthorSearchForm, PrivateRoute, Navbar
├─ features/
│  ├─ blueprints/    blueprintsSlice.js (Redux Toolkit)
│  └─ auth/          authSlice.js
├─ pages/            HomePage, LoginPage, CreateBlueprintPage
├─ services/
│  ├─ apiClient.js       axios + interceptores JWT
│  ├─ apiMock.js         datos de prueba en memoria
│  ├─ apiRemote.js       API REST real (misma interfaz que apiMock)
│  ├─ blueprintsService.js  conmutación mock/real vía VITE_USE_MOCK
│  └─ authService.js
├─ store/index.js    Redux Toolkit store
tests/               Vitest + Testing Library
.github/workflows/ci.yml
```

## Funcionalidad implementada

1. **Canvas**: `BlueprintCanvas` (520×360, id `blueprint-canvas`) dibuja los segmentos de recta del plano y marca cada punto.
2. **Listado por autor**: formulario de búsqueda + tabla (nombre, número de puntos, botón *Open*).
3. **Selección y graficado**: al pulsar *Open* se actualiza el nombre del plano actual en el estado global (Redux) y se dibuja en el canvas.
4. **Servicios intercambiables**: `apiMock` y `apiRemote` comparten la interfaz `{ getAll, getByAuthor, getByAuthorAndName, create }`.
5. **JWT y rutas protegidas**: login (mock o real), interceptor de Axios que adjunta el token, `PrivateRoute` protege `/new`.
6. **Estilos**: Bootstrap 5 para tabla, botones y tarjetas.
7. **Pruebas**: render del canvas, envío de formularios, reducers y thunks de Redux (`fetchByAuthor`, `openBlueprint`).

## Scripts

| Script            | Descripción                        |
| ----------------- | ----------------------------------- |
| `npm run dev`      | servidor de desarrollo Vite         |
| `npm run build`    | build de producción                 |
| `npm run preview`  | previsualizar build                 |
| `npm run lint`     | oxlint                              |
| `npm run format`   | Prettier                            |
| `npm test`         | Vitest                              |

## Extensiones sugeridas (no implementadas aún)

- CRUD completo (`PUT`/`DELETE`) con optimistic updates.
- Dibujo interactivo en el canvas (click para agregar puntos).
- RTK Query para caching, MSW para mocks sin backend, dark mode.
