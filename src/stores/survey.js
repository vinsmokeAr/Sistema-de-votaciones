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

  const recentSurveys = ref([]);
  const loading = ref(false);
  const error = ref('');
  const isEditing = ref(false);

  // Obtener encuestas recientes
  async function getRecentSurveys() {
    try {
      loading.value = true;
      const { data } = await axiosInstance.get('/api/admin/surveys', {
        params: {
          limit: 10,
          sort: 'date_created',
          order: 'desc'
        }
      });

      if (data.status === 'success') {
        recentSurveys.value = data.data;
      } else {
        throw new Error(data.message || 'Error al cargar las encuestas');
      }
    } catch (err) {
      console.error('Error en getRecentSurveys:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Obtener detalles de una encuesta específica
  async function getSurveyDetails(surveyId) {
    try {
      loading.value = true;
      const { data } = await axiosInstance.get(`/api/admin/surveys/${surveyId}`);

      if (data.status === 'success') {
        // Actualizar la encuesta en la lista de recientes si existe
        const index = recentSurveys.value.findIndex(s => s.survey_uuid === surveyId);
        if (index !== -1) {
          recentSurveys.value[index] = data.data;
        }
        return data.data;
      } else {
        throw new Error(data.message || 'Error al cargar los detalles de la encuesta');
      }
    } catch (err) {
      console.error('Error en getSurveyDetails:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Actualizar estado de una encuesta
  async function updateSurveyState(surveyId, newState) {
    try {
      loading.value = true;
      const { data } = await axiosInstance.put(`/api/admin/surveys/${surveyId}`, {
        current_state: newState
      });

      if (data.status === 'success') {
        // Actualizar el estado en la lista de recientes
        const index = recentSurveys.value.findIndex(s => s.survey_uuid === surveyId);
        if (index !== -1) {
          recentSurveys.value[index].current_state = newState;
        }
        return true;
      } else {
        throw new Error(data.message || 'Error al actualizar el estado de la encuesta');
      }
    } catch (err) {
      console.error('Error en updateSurveyState:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  // Obtener encuesta específica
  async function getSurvey(uuid) {
    try {
      loading.value = true;
      error.value = '';

      const { data } = await axiosInstance.get(`/api/surveys/${uuid}`);

      if (data.status === 'success') {
        currentSurvey.value = {
          uuid: data.data.survey_uuid,
          name: data.data.name,
          description: data.data.description,
          state: data.data.current_state,
          icon: data.data.icon,
          choices: data.data.choices.map(choice => ({
            id: choice.choice_id,
            title: choice.content,
            image: choice.image,
            total_selections: choice.total_selections
          }))
        };
        isEditing.value = true;
        return data.data;
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar la encuesta';
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
    recentSurveys,
    loading,
    error,
    isEditing,
    getSurvey,
    getRecentSurveys,
    getSurveyDetails,
    updateSurveyState,
    saveSurvey,
    updateCurrentSurvey,
    addChoice,
    removeChoice,
    clearCurrentSurvey,
    initializeFromTemplate
  };
});