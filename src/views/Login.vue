<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  username: '',
  password: ''
});

const validationError = ref('');

async function handleLogin() {
  validationError.value = '';

  // Validación básica
  if (!credentials.value.username || !credentials.value.password) {
    validationError.value = 'Por favor complete todos los campos';
    return;
  }

  const success = await authStore.login(credentials.value);

  if (success) {
    router.push({ name: 'plantillas' });
  }
}
</script>

<template>
  <div class="row d-flex justify-content-center">
    <div class="col-xl-10 col-lg-12 col-md-9">
      <div class="card o-hidden border-0 shadow-lg my-5">
        <div class="card-body p-0">
          <div class="row">
            <!-- Columna de la imagen -->
            <div class="col-lg-6 d-none d-lg-block bg-login-image">
              <img style="height: 100%; width: 100%; object-fit: cover;" src="/src/assets/images/votacionesNueva.jpg"
                alt="Login imagen">
            </div>
            <!-- Columna del formulario -->
            <div class="col-lg-6">
              <div class="p-5 d-flex flex-column justify-content-center" style="min-height: 100%;">
                <div class="text-center mb-4">
                  <h1 class="h4 text-gray-900">Accede al panel de administrador</h1>
                  <small class="text-muted">Ingresa tus credenciales para acceder</small>
                </div>

                <!-- Mensaje de error -->
                <div v-if="authStore.error || validationError" class="alert alert-danger">
                  {{ authStore.error || validationError }}
                </div>

                <form @submit.prevent="handleLogin" class="user">
                  <div class="form-group mb-3">
                    <input v-model="credentials.username" type="text" class="form-control form-control-user"
                      id="username" placeholder="Usuario" :disabled="authStore.loading">
                  </div>
                  <div class="form-group mb-3">
                    <input v-model="credentials.password" type="password" class="form-control form-control-user"
                      id="password" placeholder="Contraseña" :disabled="authStore.loading">
                  </div>
                  <button type="submit" class="btn btn-primary btn-user btn-block w-100" :disabled="authStore.loading">
                    <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control-user {
  padding: 0.75rem;
  font-size: 0.9rem;
  border-radius: 10rem;
}

.btn-user {
  font-size: 0.9rem;
  border-radius: 10rem;
  padding: 0.75rem 1rem;
}
</style>