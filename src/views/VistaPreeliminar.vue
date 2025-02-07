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
const selectedChoice = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    const { survey: surveyId = "" } = route.query;

    if (!surveyId) {
        router.push({ name: "crear-votacion" });
        return;
    }

    try {
        survey.value = await surveyStore.getSurvey(surveyId);
        loading.value = false;
    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
        error.value = 'No se pudo cargar la encuesta';
        loading.value = false;
    }
});

function regresarOpciones() {
    router.push({
        name: "crear-votacion",
        query: { fromPreview: true }
    });
}

function compartirEncuesta() {
    router.push({
        name: "compartir",
        query: { survey: route.query.survey }
    });
}
</script>

<template>
    <div class="container my-5">
        <!-- Barra de progreso -->
        <div class="progress-container mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div class="progress flex-grow-1 mx-3">
                    <div class="progress-bar" role="progressbar" style="width: 66%"></div>
                </div>
            </div>
            <div class="d-flex justify-content-between mt-2 text-muted small">
                <span>Crear</span>
                <span class="text-primary fw-bold">Vista previa</span>
                <span>Compartir</span>
            </div>
        </div>

        <!-- Alerta de vista previa -->
        <div class="alert alert-info d-flex align-items-center mb-4">
            <iconify-icon icon="mdi:eye" class="me-2" width="24" />
            <div>
                Esta es una vista previa de tu encuesta. Así es como la verán los participantes.
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <!-- Estados de carga y error -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>

                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>

                <!-- Contenido de la encuesta -->
                <div v-else-if="survey" class="survey-preview">
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

                    <!-- Opciones -->
                    <div class="options-container">
                        <div v-for="choice in survey.choices" :key="choice.choice_id" class="option-card mb-3"
                            :class="{ 'selected': selectedChoice === choice.choice_id }"
                            @click="selectedChoice = choice.choice_id">
                            <div class="d-flex align-items-center">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" :id="'choice-' + choice.choice_id"
                                        name="survey-choice" :value="choice.choice_id" v-model="selectedChoice">
                                </div>

                                <img v-if="choice.image" :src="choice.image" :alt="choice.content"
                                    class="option-image mx-3">

                                <label class="form-check-label flex-grow-1" :for="'choice-' + choice.choice_id">
                                    {{ choice.content }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Botón de votar (deshabilitado en vista previa) -->
                    <button class="btn btn-primary w-100 mt-4" disabled>
                        Votar
                    </button>
                </div>
            </div>
        </div>
        <!-- Botones de acción -->
        <div class="d-flex justify-content-between mt-4">
            <div>
                <button class="btn btn-outline-primary me-2" @click="regresarOpciones">
                    <iconify-icon icon="mdi:pencil" class="me-1" />
                    Editar encuesta
                </button>
                <button class="btn btn-primary" @click="compartirEncuesta" :disabled="!survey">
                    Continuar
                    <iconify-icon icon="mdi:arrow-right" class="ms-1" />
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
}

.progress-container {
    max-width: 600px;
    margin: 0 auto;
}

.progress {
    height: 4px;
}

.survey-preview {
    max-width: 600px;
    margin: 0 auto;
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

/* Vista móvil */
.mobile-preview .survey-preview {
    max-width: 380px;
    padding: 20px;
    border: 10px solid #333;
    border-radius: 30px;
    background: #fff;
    margin: 0 auto;
}

/* Vista desktop */
.desktop-preview .survey-preview {
    max-width: 800px;
    padding: 30px;
    border: 20px solid #333;
    border-radius: 10px;
    background: #fff;
    margin: 0 auto;
}

.btn-group .btn.active {
    background-color: #e9ecef;
    border-color: #dee2e6;
}

/* Animaciones */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .option-image {
        width: 40px;
        height: 40px;
    }

    .btn-group {
        width: 100%;
        margin-bottom: 1rem;
    }

    .d-flex.justify-content-between {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
</style>