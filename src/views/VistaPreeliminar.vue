<script setup>
import { useRoute } from 'vue-router';
import { watch, onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const survey = ref(null);
const error = ref('');
const selectedChoice = ref(null);

onMounted(async () => {
    const { survey: surveyUuid } = route.query;

    if (surveyUuid) {
        try {
            const surveyData = await surveyStore.getSurvey(surveyUuid);
            survey.value = surveyData;
        } catch (err) {
            error.value = 'Error al cargar la encuesta';
            console.error(err);
        }
    }
});

function regresarOpciones() {
    router.push({ name: "crear-votacion" });
}

function compartirEncuesta() {
    if (!survey.value?.uuid) {
        error.value = 'No se puede compartir una encuesta sin identificador';
        return;
    }

    router.push({
        name: "compartir",
        query: { survey: survey.value.uuid }
    });
}
</script>

<template>
    <div class="container my-5 p-4 border rounded-3">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <!-- Título de vista preliminar -->
        <p>Esto es una vista preliminar de tu votación.</p>

        <div v-if="survey">
            <!-- Título y emoji de la encuesta -->
            <div class="d-flex align-items-center mb-3">
                <iconify-icon :icon="survey.icon" width="32" height="32" class="me-2" />
                <h6 class="fw-bold mb-0">{{ survey.title }}</h6>
            </div>

            <!-- Opciones de votación -->
            <div class="mb-4">
                <div v-for="choice in survey.choices" :key="choice.id" class="form-check mb-2">
                    <input type="radio" class="form-check-input" name="votacion" :id="'choice-' + choice.id"
                        v-model="selectedChoice" :value="choice.id">
                    <label class="form-check-label" :for="'choice-' + choice.id">
                        {{ choice.title }}
                    </label>
                </div>
            </div>
        </div>

        <!-- Botones de Cancelar y Aceptar -->
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click.prevent="regresarOpciones">
                Regresar
            </button>
            <button type="button" class="btn btn-primary" @click.prevent="compartirEncuesta">
                Aceptar
            </button>
        </div>
    </div>
</template>