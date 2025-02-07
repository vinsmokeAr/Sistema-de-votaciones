// stores/survey.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '../services/axios';

export const useSurveyStore = defineStore('survey', () => {
  const currentSurvey = ref({
    uuid: null,
    name: '',
    description: '',
    state: 'pending',
    icon: 'twemoji:writing-hand',
    choices: []
  });

  const loading = ref(false);
  const error = ref('');
  const isEditing = ref(false);

  // Obtener encuesta específica
  async function getSurvey(uuid) {
    try {
      loading.value = true;
      error.value = '';

      const { data } = await axiosInstance.get(`/api/surveys/${uuid}`);

      if (data.status === 'success') {
        // Actualizar el estado actual con los datos recibidos
        currentSurvey.value = {
          uuid: data.data.survey_uuid,
          name: data.data.name,
          description: data.data.description,
          state: data.data.current_state,
          icon: data.data.icon,
          choices: data.data.choices.map(choice => ({
            id: choice.choice_id,
            title: choice.content,
            image: choice.image
          }))
        };
        isEditing.value = true;
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

  // Crear o actualizar encuesta
  async function saveSurvey() {
    try {
      loading.value = true;
      error.value = '';

      const surveyData = prepareSurveyData();
      let response;

      if (isEditing.value && currentSurvey.value.uuid) {
        // Actualizar encuesta existente
        response = await axiosInstance.put(
          `/api/admin/surveys/${currentSurvey.value.uuid}`,
          surveyData
        );
        return currentSurvey.value.uuid;
      } else {
        // Crear nueva encuesta
        response = await axiosInstance.post('/api/admin/surveys', surveyData);
        if (response.data.status === 'success') {
          currentSurvey.value.uuid = response.data.data.uuid;
          isEditing.value = true;
          return response.data.data.uuid;
        }
      }

      throw new Error(response.data.message || 'Error al guardar la encuesta');
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
        choice_id: choice.id,
        content: choice.title,
        image: choice.image
      }))
    };
  }

  function initializeFromTemplate(template) {
    isEditing.value = false;
    currentSurvey.value = {
      uuid: null,
      name: template.title || 'Nueva Encuesta',
      description: '',
      state: 'pending',
      icon: template.icon || 'twemoji:writing-hand',
      choices: template.opciones?.map(opcion => ({
        title: opcion.title,
        image: opcion.image
      })) || []
    };
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
      uuid: null,
      name: '',
      description: '',
      state: 'pending',
      icon: 'twemoji:writing-hand',
      choices: []
    };
    isEditing.value = false;
  }

  return {
    currentSurvey,
    loading,
    error,
    isEditing,
    getSurvey,
    saveSurvey,
    updateCurrentSurvey,
    addChoice,
    removeChoice,
    clearCurrentSurvey,
    initializeFromTemplate
  };
});