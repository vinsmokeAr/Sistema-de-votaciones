// stores/survey.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '../services/axios';

export const useSurveyStore = defineStore('survey', () => {
  const currentSurvey = ref({
    name: '',
    description: '',
    state: 'pending',
    icon: 'twemoji:writing-hand',
    choices: []
  });

  const loading = ref(false);
  const error = ref('');

  // Obtener encuesta específica
  async function getSurvey(uuid) {
    try {
      loading.value = true;
      error.value = '';

      const { data } = await axiosInstance.get(`/api/surveys/${uuid}`);

      if (data.status === 'success') {
        return data.data;
      }

      throw new Error(data.message || 'Error al obtener la encuesta');
    } catch (e) {
      error.value = e.response?.data?.message || 'Error en el servidor';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Crear nueva encuesta
  async function createSurvey(surveyData) {
    try {
      loading.value = true;
      error.value = '';

      const { data } = await axiosInstance.post('/api/admin/surveys', surveyData);

      if (data.status === 'success') {
        return data.data.uuid;
      }

      throw new Error(data.message || 'Error al crear la encuesta');
    } catch (e) {
      error.value = e.response?.data?.message || 'Error en el servidor';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // Preparar datos de la encuesta para enviar
  function prepareSurveyData() {
    return {
      name: currentSurvey.value.name,
      description: currentSurvey.value.description || 'Sin descripción',
      state: currentSurvey.value.state,
      icon: currentSurvey.value.icon,
      choices: currentSurvey.value.choices.map(choice => ({
        content: choice.title,
        image: choice.image
      }))
    };
  }

  // Guardar encuesta actual
  async function saveSurvey() {
    try {
      const surveyData = prepareSurveyData();
      const uuid = await createSurvey(surveyData);
      return uuid;
    } catch (e) {
      throw e;
    }
  }

  // Actualizar campos de la encuesta actual
  function updateCurrentSurvey(field, value) {
    currentSurvey.value[field] = value;
  }

  // Añadir opción a la encuesta
  function addChoice(choice = { title: 'Nueva opción', image: null }) {
    currentSurvey.value.choices.push(choice);
  }

  // Eliminar opción de la encuesta
  function removeChoice(index) {
    currentSurvey.value.choices.splice(index, 1);
  }

  // Limpiar encuesta actual
  function clearCurrentSurvey() {
    currentSurvey.value = {
      name: '',
      description: '',
      state: 'pending',
      icon: 'twemoji:writing-hand',
      choices: []
    };
  }

  return {
    currentSurvey,
    loading,
    error,
    getSurvey,        // Añadimos getSurvey al return
    saveSurvey,
    updateCurrentSurvey,
    addChoice,
    removeChoice,
    clearCurrentSurvey
  };
});