// Enlace.vue
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const surveyUrl = ref('');
const copySuccess = ref(false);

onMounted(async () => {
  const { survey = "" } = route.query;
  if (survey) {
    // Construir la URL para la encuesta
    surveyUrl.value = `${import.meta.env.VITE_SURVEY_APP_URL}/survey/${survey}`;
  } else {
    // Si no hay ID de encuesta, regresar a la página anterior
    router.push({ name: "preeliminar" });
  }
});

async function copiarEnlace() {
  try {
    await navigator.clipboard.writeText(surveyUrl.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
  }
}

function regresarPreeliminar() {
  router.push({ name: "preeliminar" });
}

function resultadosF() {
  router.push({
    name: "resultados",
    query: { survey: route.query.survey }
  });
}
</script>

<template>
  <div class="container my-5 p-4 border rounded-3">
    <!-- Título de compartir enlace -->
    <h5 class="fw-bold">Compartir encuesta</h5>
    <p class="text-muted">Comparte este enlace para que otros puedan participar en tu encuesta</p>

    <!-- Campo de enlace con botón para copiar -->
    <div class="input-group my-4">
      <input type="text" class="form-control" :value="surveyUrl" readonly aria-label="URL de la encuesta">
      <button class="btn btn-outline-primary" type="button" @click="copiarEnlace"
        :class="{ 'btn-success': copySuccess }">
        <iconify-icon :icon="copySuccess ? 'mdi:check' : 'mdi:content-copy'" class="me-1" />
        {{ copySuccess ? 'Copiado!' : 'Copiar' }}
      </button>
    </div>

    <!-- QR Code preview placeholder -->
    <div class="text-center mb-4">
      <p class="text-muted">También puedes compartir usando este código QR:</p>
      <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(surveyUrl)}`"
        alt="QR Code" class="img-fluid" style="max-width: 150px;" />
    </div>

    <!-- Botones de acción -->
    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-secondary me-2" @click="regresarPreeliminar">
        Regresar
      </button>
      <button type="button" class="btn btn-primary" @click="resultadosF">
        Ver resultados
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-outline-primary:hover {
  color: white;
}

.btn-success {
  transition: all 0.3s ease;
}
</style>