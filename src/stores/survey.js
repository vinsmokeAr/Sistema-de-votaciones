// stores/survey.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '../services/axios';

export const useSurveyStore = defineStore('survey', () => {
  const currentSurvey = ref({
    uuid: null,
    name: '',
    description: '',
    state: 'enabled',
    icon: 'twemoji:writing-hand',
    choices: []
  });

  const recentSurveys = ref([]);
  const loading = ref(false);
  const error = ref('');
  const isEditing = ref(false);

  const choicesToDelete = ref([]);

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
  function saveSurvey() {
    loading.value = true;
    error.value = '';

    const surveyData = {
      ...prepareSurveyData(),
      state: 'enabled' // Aseguramos que se guarde como enabled
    };

    const request = isEditing.value && currentSurvey.value.uuid
      ? axiosInstance.put(`/api/admin/surveys/${currentSurvey.value.uuid}`, surveyData)
      : axiosInstance.post('/api/admin/surveys', surveyData);

    return request
      .then(({ data }) => {
        if (data.status === 'success') {
          if (!isEditing.value) {
            currentSurvey.value = {
              ...currentSurvey.value,
              uuid: data.data.uuid,
              state: 'enabled'
            };
            isEditing.value = true;
          }
          // Limpiar el array de opciones a eliminar después de guardar exitosamente
          choicesToDelete.value = [];
          return currentSurvey.value.uuid;
        }
        throw new Error(data.message || 'Error al guardar la encuesta');
      })
      .catch((err) => {
        error.value = err.response?.data?.message || 'Error en el servidor';
        throw err;
      })
      .finally(() => {
        loading.value = false;
      });
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
      })),
      // Incluir los IDs de las opciones a eliminar
      choices_to_delete: choicesToDelete.value
    };
  }


  function initializeFromTemplate(template) {
    // Primero limpiar completamente el estado
    clearCurrentSurvey();

    const newSurvey = {
      uuid: null, // Asegurarse que el uuid sea null
      name: template.title || 'Nueva Encuesta',
      description: '',
      state: 'enabled', // Cambiado de 'pending' a 'enabled'
      icon: template.icon || 'twemoji:writing-hand',
      choices: template.opciones?.map(opcion => ({
        id: null, // Asegurarse que los ids sean null
        title: opcion.title,
        image: opcion.image
      })) || []
    };

    // Asignar el nuevo survey con una nueva referencia
    currentSurvey.value = { ...newSurvey };
    isEditing.value = false; // Asegurarse que no estamos en modo edición
    choicesToDelete.value = []; // Limpiar las opciones a eliminar
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
    const choiceToRemove = currentSurvey.value.choices[index];

    // Si la opción tiene ID, agregarla al array de opciones a eliminar
    if (choiceToRemove.id) {
      choicesToDelete.value.push(choiceToRemove.id);
    }

    // Filtrar la opción del array de choices
    const newChoices = currentSurvey.value.choices.filter((_, i) => i !== index);
    currentSurvey.value = {
      ...currentSurvey.value,
      choices: newChoices
    };
  }

  // Limpiar encuesta actual
  function clearCurrentSurvey() {
    const emptySurvey = {
      uuid: null,
      name: '',
      description: '',
      state: 'enabled', // Cambiado de 'pending' a 'enabled'
      icon: 'twemoji:writing-hand',
      choices: []
    };
    currentSurvey.value = { ...emptySurvey };
    choicesToDelete.value = [];
    isEditing.value = false;
    error.value = '';
  }

  function finalizarEncuesta(surveyId) {
    loading.value = true;
    error.value = '';

    return axiosInstance.put(`/api/admin/surveys/${surveyId}`, {
      state: 'disabled'
    })
      .then(({ data }) => {
        if (data.status === 'success') {
          // Actualizar el estado en la encuesta actual si corresponde
          if (currentSurvey.value.uuid === surveyId) {
            currentSurvey.value = {
              ...currentSurvey.value,
              state: 'disabled'
            };
          }

          // Actualizar el estado en las encuestas recientes
          const index = recentSurveys.value.findIndex(s => s.survey_uuid === surveyId);
          if (index !== -1) {
            recentSurveys.value[index].current_state = 'disabled';
          }

          return true;
        }
        throw new Error(data.message || 'Error al finalizar la encuesta');
      })
      .catch((err) => {
        error.value = err.response?.data?.message || 'Error al finalizar la encuesta';
        throw err;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  return {
    currentSurvey,
    recentSurveys,
    loading,
    error,
    isEditing,
    choicesToDelete,
    getSurvey,
    getRecentSurveys,
    getSurveyDetails,
    updateSurveyState,
    saveSurvey,
    updateCurrentSurvey,
    addChoice,
    removeChoice,
    clearCurrentSurvey,
    initializeFromTemplate,
    finalizarEncuesta
  };
});