import apiMock from './apiMock.js';
import apiRemote from './apiRemote.js';

// Punto único de conmutación entre el servicio mock y el real.
// Cambiar de fuente de datos es una sola línea: la variable de entorno
// VITE_USE_MOCK (ver .env.example).
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const blueprintsService = useMock ? apiMock : apiRemote;

export default blueprintsService;
