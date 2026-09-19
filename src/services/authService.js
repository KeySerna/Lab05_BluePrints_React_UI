import httpClient from './apiClient.js';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// Credenciales válidas del mock, para poder probar rutas protegidas
// sin backend real.
const MOCK_USER = { username: 'admin', password: 'admin123' };

function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        resolve({ token: 'mock-jwt-token.' + btoa(username) });
      } else {
        reject(new Error('Usuario o contraseña inválidos'));
      }
    }, 200);
  });
}

async function remoteLogin(username, password) {
  const { data } = await httpClient.post('/auth/login', { username, password });
  return data; // { token }
}

export function login(username, password) {
  return useMock ? mockLogin(username, password) : remoteLogin(username, password);
}
