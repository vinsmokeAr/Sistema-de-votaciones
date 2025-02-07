// Votacion.vue
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axiosInstance from '../services/axios';

const route = useRoute();
const router = useRouter();

const survey = ref(null);
const selectedChoice = ref(null);
const loading = ref(true);
const error = ref(null);
const votingSuccess = ref(false);
const votingError = ref('');

onMounted(async () => {
  const surveyId = route.params.uuid;
  if (!surveyId) {
    error.value = 'No se encontró la encuesta';
    loading.value = false;
    return;
  }

  try {
    const { data } = await axiosInstance.get(`/api/surveys/${surveyId}`);
    if (data.status === 'success') {
      survey.value = data.data;

      // Verificar si la encuesta está activa
      if (survey.value.current_state !== 'enabled') {
        error.value = 'Esta encuesta ya no está disponible para votar';
      }
    }
  } catch (err) {
    console.error('Error al cargar la encuesta:', err);
    error.value = 'No se pudo cargar la encuesta';
  } finally {
    loading.value = false;
  }
});

async function submitVote() {
  if (!selectedChoice.value) {
    votingError.value = 'Por favor selecciona una opción';
    return;
  }

  try {
    loading.value = true;
    votingError.value = '';

    const { data } = await axiosInstance.post(
      `/api/surveys/${survey.value.survey_uuid}/selections/${selectedChoice.value}`
    );

    if (data.status === 'success') {
      votingSuccess.value = true;
    } else {
      throw new Error(data.message || 'Error al registrar el voto');
    }
  } catch (err) {
    console.error('Error al votar:', err);
    votingError.value = 'No se pudo registrar tu voto. Por favor intenta nuevamente.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container my-5">
    <!-- Estados de carga y error -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Mensaje de éxito -->
    <div v-else-if="votingSuccess" class="card shadow-sm">
      <div class="card-body text-center py-5">
        <iconify-icon icon="mdi:check-circle" class="text-success mb-3" width="64" height="64" />
        <h3 class="mb-3">¡Gracias por tu voto!</h3>
        <p class="text-muted mb-0">Tu voto ha sido registrado exitosamente.</p>
      </div>
    </div>

    <!-- Contenido de la encuesta -->
    <div v-else-if="survey" class="card shadow-sm">
      <div class="card-body p-4">
        <!-- Encabezado -->
        <div class="d-flex align-items-center mb-4">
          <iconify-icon :icon="survey.icon" width="40" height="40" class="me-3" />
          <div>
            <h2 class="mb-1">{{ survey.name }}</h2>
            <p class="text-muted mb-0" v-if="survey.description">
              {{ survey.description }}
            </p>
          </div>
        </div>

        <!-- Error de votación -->
        <div v-if="votingError" class="alert alert-danger mb-4">
          {{ votingError }}
        </div>

        <!-- Opciones -->
        <div class="options-container">
          <div v-for="choice in survey.choices" :key="choice.choice_id" class="option-card mb-3"
            :class="{ 'selected': selectedChoice === choice.choice_id }" @click="selectedChoice = choice.choice_id">
            <div class="d-flex align-items-center">
              <div class="form-check">
                <input class="form-check-input" type="radio" :id="'choice-' + choice.choice_id" name="survey-choice"
                  :value="choice.choice_id" v-model="selectedChoice">
              </div>

              <img v-if="choice.image" :src="choice.image" :alt="choice.content" class="option-image mx-3">

              <label class="form-check-label flex-grow-1" :for="'choice-' + choice.choice_id">
                {{ choice.content }}
              </label>
            </div>
          </div>
        </div>

        <!-- Botón de votar -->
        <button class="btn btn-primary w-100 mt-4" @click="submitVote" :disabled="!selectedChoice || loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ loading ? 'Enviando...' : 'Votar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}

.option-card {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: #6c757d;
  background-color: #f8f9fa;
}

.option-card.selected {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.option-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .option-image {
    width: 40px;
    height: 40px;
  }
}
</style>