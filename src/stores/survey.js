import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '../services/axios';

export const useSurveyStore = defineStore('survey', () => {
  const currentSurvey = ref(null);
  const surveys = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function createSurvey(surveyData) {
    try {
      loading.value = true;
      error.value = '';
      const { data } = await axiosInstance.post('/api/admin/surveys', surveyData);
      currentSurvey.value = data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear la encuesta';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateSurvey(uuid, surveyData) {
    try {
      loading.value = true;
      error.value = '';
      const { data } = await axiosInstance.put(`/api/admin/surveys/${uuid}`, surveyData);
      currentSurvey.value = data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar la encuesta';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSurvey(uuid) {
    try {
      loading.value = true;
      error.value = '';
      await axiosInstance.delete(`/api/admin/surveys/${uuid}`);
      surveys.value = surveys.value.filter(s => s.uuid !== uuid);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar la encuesta';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function getAllSurveys() {
    try {
      loading.value = true;
      error.value = '';
      const { data } = await axiosInstance.get('/api/admin/surveys');
      surveys.value = data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener las encuestas';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function getSurvey(uuid) {
    try {
      loading.value = true;
      error.value = '';
      const { data } = await axiosInstance.get(`/api/surveys/${uuid}`);
      currentSurvey.value = data;
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener la encuesta';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    currentSurvey,
    surveys,
    loading,
    error,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getAllSurveys,
    getSurvey
  };
});