// services/axios.js
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';

// Crear instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requests
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Manejar errores de respuesta
      switch (error.response.status) {
        case 401: // No autorizado
          const authStore = useAuthStore();
          authStore.logout();
          router.push({ name: 'home' });
          break;
        case 403: // Prohibido
          router.push({ name: 'home' });
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Axios público sin token (para login)
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export { axiosInstance as default, axiosPublic };