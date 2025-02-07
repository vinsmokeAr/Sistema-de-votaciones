// EncuestasRealizadas.vue
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';

const router = useRouter();
const surveyStore = useSurveyStore();

const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;
const sortBy = ref('fecha');
const sortOrder = ref('desc');
const showDeleteModal = ref(false);
const surveyToDelete = ref(null);

function calcularTotalVotos(survey) {
  if (!survey.choices) return 0;
  return survey.choices.reduce((sum, choice) => sum + (choice.total_selections || 0), 0);
}

// Encuestas filtradas y ordenadas
const filteredSurveys = computed(() => {
  let filtered = [...surveyStore.recentSurveys];

  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(survey =>
      survey.name.toLowerCase().includes(query) ||
      new Date(survey.date_created).toLocaleDateString().includes(query)
    );
  }

  // Aplicar ordenamiento
  filtered.sort((a, b) => {
    let compareValue;
    switch (sortBy.value) {
      case 'fecha':
        compareValue = new Date(b.date_created) - new Date(a.date_created);
        break;
      case 'nombre':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'participantes':
        compareValue = calcularTotalVotos(b) - calcularTotalVotos(a);
        break;
      default:
        compareValue = 0;
    }
    return sortOrder.value === 'desc' ? compareValue : -compareValue;
  });

  return filtered;
});
// Encuestas paginadas
const paginatedSurveys = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredSurveys.value.slice(start, end);
});

// Total de páginas
const totalPages = computed(() =>
  Math.ceil(filteredSurveys.value.length / itemsPerPage)
);

// Cargar encuestas
async function loadSurveys() {
  try {
    loading.value = true;
    error.value = '';
    await surveyStore.getRecentSurveys();
  } catch (err) {
    error.value = 'Error al cargar las encuestas';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Acciones de encuesta
function verEnlace(surveyId) {
  router.push({
    name: "compartir",
    query: { survey: surveyId }
  });
}

function verResultados(surveyId) {
  router.push({
    name: "resultados",
    query: { survey: surveyId }
  });
}

function editarEncuesta(surveyId) {
  router.push({
    name: "crear-votacion",
    query: { edit: surveyId }
  });
}

async function toggleEstado(survey) {
  try {
    loading.value = true;
    const newState = survey.current_state === 'enabled' ? 'disabled' : 'enabled';
    await surveyStore.updateSurveyState(survey.survey_uuid, newState);
    await loadSurveys(); // Recargar para obtener datos actualizados
  } catch (err) {
    error.value = 'Error al cambiar el estado de la encuesta';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function confirmarEliminar(survey) {
  surveyToDelete.value = survey;
  showDeleteModal.value = true;
}

async function eliminarEncuesta() {
  if (!surveyToDelete.value) return;

  try {
    loading.value = true;
    await surveyStore.deleteSurvey(surveyToDelete.value.survey_uuid);
    await loadSurveys();
    showDeleteModal.value = false;
    surveyToDelete.value = null;
  } catch (err) {
    error.value = 'Error al eliminar la encuesta';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Funciones de paginación
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function toggleSort(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'desc';
  }
}

onMounted(() => {
  loadSurveys();
});
</script>

<template>
  <div class="container my-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Encuestas Realizadas</h2>
      <button class="btn btn-primary" @click="router.push({ name: 'plantillas' })">
        <iconify-icon icon="mdi:plus" class="me-1" />
        Nueva Encuesta
      </button>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <iconify-icon icon="mdi:magnify" />
              </span>
              <input type="text" class="form-control" placeholder="Buscar encuesta..." v-model="searchQuery">
            </div>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="btn-group">
              <button class="btn btn-outline-secondary" :class="{ active: sortBy === 'fecha' }"
                @click="toggleSort('fecha')">
                Fecha
                <iconify-icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" />
              </button>
              <button class="btn btn-outline-secondary" :class="{ active: sortBy === 'nombre' }"
                @click="toggleSort('nombre')">
                Nombre
                <iconify-icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" />
              </button>
              <button class="btn btn-outline-secondary" :class="{ active: sortBy === 'participantes' }"
                @click="toggleSort('participantes')">
                Participantes
                <iconify-icon :icon="sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="!paginatedSurveys.length" class="text-center py-5">
      <iconify-icon icon="mdi:poll" width="64" height="64" class="text-muted mb-3" />
      <h4>No hay encuestas</h4>
      <p class="text-muted">Comienza creando una nueva encuesta</p>
      <button class="btn btn-primary" @click="router.push({ name: 'plantillas' })">
        Crear Encuesta
      </button>
    </div>

    <!-- Survey list -->
    <div v-else class="row g-4">
      <div v-for="survey in paginatedSurveys" :key="survey.survey_uuid" class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <iconify-icon :icon="survey.icon || 'twemoji:ballot-box-with-ballot'" width="32" height="32"
                class="me-3" />
              <div class="flex-grow-1">
                <h5 class="mb-1">{{ survey.name }}</h5>
                <div class="small text-muted">
                  Creada el {{ new Date(survey.date_created).toLocaleDateString() }}
                </div>
              </div>
              <span :class="[
                'badge',
                survey.current_state === 'enabled' ? 'bg-success' : 'bg-danger'
              ]">
                {{ survey.current_state === 'enabled' ? 'Activa' : 'Finalizada' }}
              </span>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <div class="small text-muted mb-1">Total Participantes</div>
                <div class="h5 mb-0">
                  {{ calcularTotalVotos(survey) }}
                </div>
              </div>
              <div class="col-md-4">
                <div class="small text-muted mb-1">Última Actualización</div>
                <div class="h5 mb-0">
                  {{ new Date(survey.last_modified || survey.date_created).toLocaleDateString() }}
                </div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary" @click="editarEncuesta(survey.survey_uuid)">
                <iconify-icon icon="mdi:pencil" class="me-1" />
                Editar
              </button>
              <button class="btn btn-sm btn-outline-secondary" @click="verEnlace(survey.survey_uuid)">
                <iconify-icon icon="mdi:link" class="me-1" />
                Ver Enlace
              </button>
              <button class="btn btn-sm btn-outline-info" @click="verResultados(survey.survey_uuid)">
                <iconify-icon icon="mdi:chart-bar" class="me-1" />
                Resultados
              </button>
              <button class="btn btn-sm"
                :class="survey.current_state === 'enabled' ? 'btn-outline-danger' : 'btn-outline-success'"
                @click="toggleEstado(survey)">
                <iconify-icon :icon="survey.current_state === 'enabled' ? 'mdi:pause' : 'mdi:play'" class="me-1" />
                {{ survey.current_state === 'enabled' ? 'Pausar' : 'Activar' }}
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="confirmarEliminar(survey)">
                <iconify-icon icon="mdi:delete" class="me-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">
            <iconify-icon icon="mdi:chevron-left" />
          </button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">
            <iconify-icon icon="mdi:chevron-right" />
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modal de confirmación de eliminación -->
    <div class="modal fade" :class="{ 'show d-block': showDeleteModal }" tabindex="-1"
      :style="{ background: showDeleteModal ? 'rgba(0,0,0,0.5)' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar eliminación</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar la encuesta "{{ surveyToDelete?.name }}"?</p>
            <p class="text-danger mb-0">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="eliminarEncuesta">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .1);
}

.badge {
  padding: 0.5em 0.8em;
}

.btn-group .btn.active {
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .d-flex.gap-2 {
    flex-wrap: wrap;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>