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

async function update(author, name, blueprint) {
  const { data } = await httpClient.put(
    `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    blueprint
  );
  return data;
}

async function remove(author, name) {
  await httpClient.delete(`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`);
  return { author, name };
}

export const apiRemote = { getAll, getByAuthor, getByAuthorAndName, create, update, remove };
export default apiRemote;
