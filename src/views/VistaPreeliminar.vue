// VistaPreeliminar.vue
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const survey = ref(null);

onMounted(async () => {
    const { survey: surveyId = "" } = route.query;

    if (!surveyId) {
        router.push({ name: "crear-votacion" });
        return;
    }

    try {
        survey.value = await surveyStore.getSurvey(surveyId);
    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
    }
});

function regresarOpciones() {
    router.push({ name: "crear-votacion" });
}

function compartirEncuesta() {
    router.push({
        name: "compartir",
        query: { survey: route.query.survey }
    });
}
</script>

<template>
    <div class="container my-5 p-4 border rounded-3">
        <!-- Título de vista preliminar -->
        <div class="alert alert-info">
            <p class="mb-0">Esta es una vista preliminar de tu encuesta. Así es como la verán los participantes.</p>
        </div>

        <div v-if="survey" class="preview-container">
            <!-- Título y descripción de la encuesta -->
            <h4 class="fw-bold">{{ survey.name }}</h4>
            <p>{{ survey.description }}</p>

            <!-- Opciones de votación -->
            <div class="mb-4">
                <div v-for="choice in survey.choices" :key="choice.choice_id" class="form-check mb-2">
                    <input type="radio" class="form-check-input" name="votacion" :id="'opcion' + choice.choice_id">
                    <label class="form-check-label" :for="'opcion' + choice.choice_id">
                        {{ choice.content }}
                    </label>
                    <img v-if="choice.image" :src="choice.image" class="ms-2" alt="Opción imagen"
                        style="max-height: 30px;">
                </div>
            </div>
        </div>

        <div v-else class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>

        <!-- Botones de acción -->
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click="regresarOpciones">
                Regresar
            </button>
            <button type="button" class="btn btn-primary" @click="compartirEncuesta" :disabled="!survey">
                Compartir encuesta
            </button>
        </div>
    </div>
</template>

<style scoped>
.preview-container {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.form-check {
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.form-check:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
</style>