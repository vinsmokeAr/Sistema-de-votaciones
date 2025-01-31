import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 2025, // Cambia el puerto si lo necesitas
    cors: true,  // Habilitar CORS
    host: '192.168.2.106'  // Permitir conexiones desde todas las interfaces de red
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
