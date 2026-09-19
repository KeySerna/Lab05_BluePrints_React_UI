// Servicio mock: implementa la misma interfaz que apiClient.js pero
// devuelve datos de prueba desde memoria, sin llamar a ningún backend.

const MOCK_LATENCY_MS = 250;

/** @type {Record<string, Record<string, {name: string, points: {x:number, y:number}[]}>>} */
const DB = {
  jmiranda: {
    'plano-a': {
      name: 'plano-a',
      points: [
        { x: 30, y: 30 },
        { x: 120, y: 60 },
        { x: 180, y: 140 },
        { x: 260, y: 90 },
      ],
    },
    'plano-b': {
      name: 'plano-b',
      points: [
        { x: 40, y: 200 },
        { x: 90, y: 250 },
        { x: 160, y: 220 },
        { x: 220, y: 260 },
        { x: 300, y: 200 },
      ],
    },
  },
  agomez: {
    'casa-1': {
      name: 'casa-1',
      points: [
        { x: 20, y: 20 },
        { x: 200, y: 20 },
        { x: 200, y: 150 },
        { x: 20, y: 150 },
        { x: 20, y: 20 },
      ],
    },
  },
};

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

function clonePlan(plan) {
  return { name: plan.name, points: plan.points.map((p) => ({ ...p })) };
}

/** GET /api/blueprints — catálogo completo (todos los autores y sus planos) */
function getAll() {
  const all = Object.entries(DB).flatMap(([author, plans]) =>
    Object.values(plans).map((plan) => ({ author, ...clonePlan(plan) }))
  );
  return delay(all);
}

/** GET /api/blueprints/{author} */
function getByAuthor(author) {
  const plans = DB[author];
  if (!plans) return delay([]);
  return delay(Object.values(plans).map(clonePlan));
}

/** GET /api/blueprints/{author}/{name} */
function getByAuthorAndName(author, name) {
  const plan = DB[author]?.[name];
  if (!plan) return Promise.reject(new Error(`Blueprint "${name}" de "${author}" no encontrado`));
  return delay(clonePlan(plan));
}

/** POST /api/blueprints (requiere JWT en apiClient real; el mock lo ignora) */
function create(author, blueprint) {
  if (!DB[author]) DB[author] = {};
  DB[author][blueprint.name] = clonePlan(blueprint);
  return delay(clonePlan(DB[author][blueprint.name]));
}

export const apiMock = { getAll, getByAuthor, getByAuthorAndName, create };
export default apiMock;
