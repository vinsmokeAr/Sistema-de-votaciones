// Resultados.vue
<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSurveyStore } from '../stores/survey';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const survey = ref(null);
const loading = ref(true);
const error = ref('');
const selectedView = ref('grafico'); // 'grafico' | 'tabla'
const showConfirmDialog = ref(false);

// Datos calculados
const totalVotos = computed(() => {
    if (!survey.value?.choices) return 0;
    return survey.value.choices.reduce((sum, choice) => sum + choice.total_selections, 0);
});

const resultadosCalculados = computed(() => {
    if (!survey.value?.choices) return [];
    return survey.value.choices.map(choice => ({
        id: choice.choice_id,
        content: choice.content,
        image: choice.image,
        votos: choice.total_selections,
        porcentaje: totalVotos.value > 0
            ? (choice.total_selections / totalVotos.value * 100).toFixed(1)
            : 0
    }));
});

onMounted(async () => {
    const surveyId = route.query.survey;
    if (!surveyId) {
        router.push({ name: 'plantillas' });
        return;
    }

    try {
        loading.value = true;
        // Iniciar actualización en tiempo real
        await cargarResultados(surveyId);
        // Actualizar cada 10 segundos
        const interval = setInterval(() => cargarResultados(surveyId), 10000);

        // Limpiar intervalo cuando el componente se desmonte
        onUnmounted(() => clearInterval(interval));
    } catch (err) {
        error.value = 'Error al cargar los resultados';
        console.error(err);
    } finally {
        loading.value = false;
    }
});

async function cargarResultados(surveyId) {
    try {
        survey.value = await surveyStore.getSurvey(surveyId);
    } catch (err) {
        console.error('Error al actualizar resultados:', err);
    }
}

async function finalizarVotacion() {
    try {
        loading.value = true;
        await surveyStore.finalizarEncuesta(survey.value.survey_uuid);
        showConfirmDialog.value = false;
        survey.value.current_state = 'disabled';
    } catch (err) {
        error.value = 'Error al finalizar la votación';
        console.error(err);
    } finally {
        loading.value = false;
    }
}

function regresarMenu() {
    router.push({ name: "plantillas" });
}

function exportarResultados() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Opción,Votos,Porcentaje\n"
        + resultadosCalculados.value.map(row =>
            `"${row.content}",${row.votos},${row.porcentaje}%`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resultados_${survey.value.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

<template>
    <div class="container my-5">
        <!-- Modal de confirmación -->
        <div class="modal fade" :class="{ 'show d-block': showConfirmDialog }" tabindex="-1"
            :style="{ background: showConfirmDialog ? 'rgba(0,0,0,0.5)' : 'none' }">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar finalización</h5>
                        <button type="button" class="btn-close" @click="showConfirmDialog = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Estás seguro de que deseas finalizar esta votación? Esta acción no se puede deshacer.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            @click="showConfirmDialog = false">Cancelar</button>
                        <button type="button" class="btn btn-danger" @click="finalizarVotacion">Finalizar
                            votación</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body p-4">
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>

                <!-- Results Content -->
                <div v-else-if="survey" class="results-content">
                    <!-- Header -->
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div class="d-flex align-items-center">
                            <iconify-icon :icon="survey.icon" width="40" height="40" class="me-3" />
                            <div>
                                <h2 class="mb-1">{{ survey.name }}</h2>
                                <div class="d-flex align-items-center">
                                    <span :class="[
                                        'badge',
                                        survey.current_state === 'enabled' ? 'bg-success' : 'bg-danger'
                                    ]">
                                        {{ survey.current_state === 'enabled' ? 'Activa' : 'Finalizada' }}
                                    </span>
                                    <span class="text-muted ms-2">
                                        {{ totalVotos }} votos totales
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Acciones -->
                        <div class="btn-group">
                            <button class="btn btn-outline-primary" @click="exportarResultados">
                                <iconify-icon icon="mdi:download" class="me-1" />
                                Exportar
                            </button>
                            <button v-if="survey.current_state === 'enabled'" class="btn btn-danger"
                                @click="showConfirmDialog = true">
                                <iconify-icon icon="mdi:stop" class="me-1" />
                                Finalizar
                            </button>
                        </div>
                    </div>

                    <!-- Vista Selector -->
                    <div class="btn-group mb-4">
                        <button class="btn btn-outline-primary" :class="{ active: selectedView === 'grafico' }"
                            @click="selectedView = 'grafico'">
                            <iconify-icon icon="mdi:chart-bar" class="me-1" />
                            Gráfico
                        </button>
                        <button class="btn btn-outline-primary" :class="{ active: selectedView === 'tabla' }"
                            @click="selectedView = 'tabla'">
                            <iconify-icon icon="mdi:table" class="me-1" />
                            Tabla
                        </button>
                    </div>

                    <!-- Resultados en Gráfico -->
                    <div v-if="selectedView === 'grafico'" class="results-chart">
                        <div v-for="result in resultadosCalculados" :key="result.id" class="result-bar-container mb-3">
                            <div class="d-flex align-items-center mb-2">
                                <img v-if="result.image" :src="result.image" class="result-image me-2"
                                    :alt="result.content">
                                <span class="result-label">{{ result.content }}</span>
                                <span class="result-percentage ms-auto">{{ result.porcentaje }}%</span>
                            </div>
                            <div class="progress" style="height: 25px;">
                                <div class="progress-bar" role="progressbar" :style="{ width: result.porcentaje + '%' }"
                                    :aria-valuenow="result.porcentaje" aria-valuemin="0" aria-valuemax="100">
                                    {{ result.votos }} votos
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Resultados en Tabla -->
                    <div v-else class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Opción</th>
                                    <th class="text-end">Votos</th>
                                    <th class="text-end">Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="result in resultadosCalculados" :key="result.id">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img v-if="result.image" :src="result.image" class="result-image me-2"
                                                :alt="result.content">
                                            {{ result.content }}
                                        </div>
                                    </td>
                                    <td class="text-end">{{ result.votos }}</td>
                                    <td class="text-end">{{ result.porcentaje }}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón de regreso -->
        <div class="d-flex justify-content-start mt-4">
            <button class="btn btn-outline-primary" @click="regresarMenu">
                <iconify-icon icon="mdi:arrow-left" class="me-1" />
                Volver al menú
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
}

.results-content {
    max-width: 700px;
    margin: 0 auto;
}

.result-image {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 4px;
}

.result-bar-container {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
}

.result-label {
    font-weight: 500;
}

.result-percentage {
    font-weight: 600;
    color: #6c757d;
}

.progress {
    background-color: #e9ecef;
    border-radius: 6px;
    overflow: hidden;
}

.progress-bar {
    background-color: #0d6efd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    transition: width 0.6s ease;
}

.btn-group .btn.active {
    background-color: #0d6efd;
    color: white;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .d-flex.justify-content-between {
        flex-direction: column;
        gap: 1rem;
    }

    .btn-group {
        width: 100%;
    }

    .btn {
        flex: 1;
    }
}
</style>