import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    // Los tests siempre corren contra el servicio mock, sin depender
    // de que exista un .env local (por ejemplo en CI).
    env: {
      VITE_USE_MOCK: 'true',
    },
  },
})