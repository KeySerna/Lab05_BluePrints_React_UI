import httpClient from './apiClient.js';

// Servicio real: consume el API REST de Blueprints con Axios.
// Misma interfaz que apiMock.js para poder intercambiarlos.

async function getAll() {
  const { data } = await httpClient.get('/blueprints');
  return data;
}

async function getByAuthor(author) {
  const { data } = await httpClient.get(`/blueprints/${encodeURIComponent(author)}`);
  return data;
}

async function getByAuthorAndName(author, name) {
  const { data } = await httpClient.get(
    `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`
  );
  return data;
}

async function create(author, blueprint) {
  const { data } = await httpClient.post('/blueprints', { author, ...blueprint });
  return data;
}

export const apiRemote = { getAll, getByAuthor, getByAuthorAndName, create };
export default apiRemote;
