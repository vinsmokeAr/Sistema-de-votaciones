// stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { axiosPublic } from '../services/axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'));
  const loading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    try {
      loading.value = true;
      error.value = '';

      const { data } = await axiosPublic.post('/api/auth/login', credentials);

      if (data.token) {
        token.value = data.token;
        user.value = data.user;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return true;
      } else {
        throw new Error(data.message || 'Error en la autenticación');
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error en el servidor';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = '';
    user.value = {};
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function checkAuth() {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      token.value = currentToken;
      user.value = JSON.parse(localStorage.getItem('user') || '{}');
      return true;
    }
    return false;
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
});