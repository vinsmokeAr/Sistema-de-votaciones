// Plantilla.vue
<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSurveyStore } from '../stores/survey';
import mockPlantillas from '../assets/mocks/plantillas.json';

const router = useRouter();
const surveyStore = useSurveyStore();
const activeTab = ref('plantillas');
const loading = ref(false);
const error = ref('');

// Obtener las plantillas del mock
const plantillasRows = computed(() => {
	const { rows = [] } = mockPlantillas;
	return rows;
});

// Obtener las votaciones recientes del store
const misVotaciones = computed(() => {
	return surveyStore.recentSurveys.map(survey => ({
		id: survey.survey_uuid,
		title: survey.name,
		icon: survey.icon || "twemoji:ballot-box-with-ballot",
		state: survey.current_state,
		totalVotos: survey.choices?.reduce((sum, choice) => sum + choice.total_selections, 0) || 0,
		fechaCreacion: survey.date_created
	}));
});

// Cargar datos al montar el componente
onMounted(async () => {
	try {
		loading.value = true;
		await surveyStore.getRecentSurveys();
	} catch (err) {
		error.value = 'Error al cargar las votaciones recientes';
		console.error(err);
	} finally {
		loading.value = false;
	}
});

function onClickTemplate(template) {
	// Primero limpiamos el estado actual
	surveyStore.clearCurrentSurvey();
	// Luego navegamos
	router.push({
		name: "crear-votacion",
		query: { template, new: true } // Agregamos flag para indicar nueva creación
	});
}

function verResultados(votacionId) {
	router.push({
		name: "resultados",
		query: { survey: votacionId }
	});
}

function editarVotacion(votacionId) {
	router.push({
		name: "crear-votacion",
		query: { edit: votacionId }
	});
}

function verHistorial() {
	router.push({ name: "encuestas-realizadas" });
}
</script>

<template>
	<div class="container my-5">
		<!-- Header -->
		<div class="d-flex justify-content-between align-items-center mb-4">
			<h2 class="mb-0">Sistema de Votaciones</h2>
			<button class="btn btn-outline-primary" @click="verHistorial">
				<iconify-icon icon="mdi:history" class="me-2" />
				Ver historial completo
			</button>
		</div>

		<!-- Tabs -->
		<ul class="nav nav-tabs mb-4">
			<li class="nav-item">
				<button class="nav-link" :class="{ active: activeTab === 'plantillas' }" @click="activeTab = 'plantillas'">
					<iconify-icon icon="mdi:template" class="me-2" />
					Plantillas
				</button>
			</li>
			<li class="nav-item">
				<button class="nav-link" :class="{ active: activeTab === 'recientes' }" @click="activeTab = 'recientes'">
					<iconify-icon icon="mdi:clock-outline" class="me-2" />
					Mis votaciones recientes
					<span v-if="misVotaciones.length" class="badge bg-primary ms-2">
						{{ misVotaciones.length }}
					</span>
				</button>
			</li>
		</ul>

		<!-- Contenido de plantillas -->
		<div v-if="activeTab === 'plantillas'" class="tab-content">
			<div class="row g-4">
				<!-- Crear desde cero -->
				<div class="col-md-4">
					<div class="card h-100 hover-shadow cursor-pointer" @click="onClickTemplate('0')">
						<div class="card-body text-center py-4">
							<iconify-icon icon="twemoji:writing-hand" width="48" height="48" class="mb-3" />
							<h5 class="card-title">Crear desde cero</h5>
							<p class="card-text text-muted">
								Comienza una nueva votación con tus propias opciones
							</p>
						</div>
					</div>
				</div>

				<!-- Plantillas predefinidas -->
				<div v-for="plantilla in plantillasRows" :key="plantilla.id" class="col-md-4">
					<div class="card h-100 hover-shadow cursor-pointer" @click="onClickTemplate(plantilla.id)">
						<div class="card-body text-center py-4">
							<iconify-icon :icon="plantilla.icon" width="48" height="48" class="mb-3" />
							<h5 class="card-title">{{ plantilla.title }}</h5>
							<p class="card-text text-muted">
								{{ plantilla.description || 'Usa esta plantilla para comenzar rápidamente' }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Contenido de votaciones recientes -->
		<div v-else class="tab-content">
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
			<div v-else-if="!misVotaciones.length" class="text-center py-5">
				<iconify-icon icon="mdi:ballot-outline" width="64" height="64" class="text-muted mb-3" />
				<h4>No hay votaciones recientes</h4>
				<p class="text-muted">Comienza creando una nueva votación desde las plantillas disponibles</p>
				<button class="btn btn-primary" @click="activeTab = 'plantillas'">
					Crear nueva votación
				</button>
			</div>

			<!-- Lista de votaciones -->
			<div v-else class="row g-4">
				<div v-for="votacion in misVotaciones" :key="votacion.id" class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<div class="d-flex align-items-center mb-3">
								<iconify-icon :icon="votacion.icon" width="32" height="32" class="me-2" />
								<h5 class="card-title mb-0">{{ votacion.title }}</h5>
								<span :class="[
									'badge ms-auto',
									votacion.state === 'enabled' ? 'bg-success' : 'bg-danger'
								]">
									{{ votacion.state === 'enabled' ? 'Activa' : 'Finalizada' }}
								</span>
							</div>

							<div class="d-flex justify-content-between mb-3">
								<span class="text-muted">
									<iconify-icon icon="mdi:calendar" class="me-1" />
									{{ new Date(votacion.fechaCreacion).toLocaleDateString() }}
								</span>
								<span class="text-muted">
									<iconify-icon icon="mdi:vote" class="me-1" />
									{{ votacion.totalVotos }} votos
								</span>
							</div>

							<div class="d-flex justify-content-end">
								<button v-if="votacion.state === 'enabled'" class="btn btn-outline-primary btn-sm me-2"
									@click.stop="editarVotacion(votacion.id)">
									<iconify-icon icon="mdi:pencil" class="me-1" />
									Editar
								</button>
								<button class="btn btn-primary btn-sm" @click.stop="verResultados(votacion.id)">
									<iconify-icon icon="mdi:chart-bar" class="me-1" />
									Ver resultados
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.hover-shadow {
	transition: all 0.3s ease;
}

.hover-shadow:hover {
	transform: translateY(-3px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
	cursor: pointer;
}

.nav-tabs .nav-link {
	border: none;
	color: #6c757d;
	padding: 0.75rem 1.25rem;
	cursor: pointer;
}

.nav-tabs .nav-link.active {
	color: #0d6efd;
	border-bottom: 2px solid #0d6efd;
	background: none;
}

.card {
	border: 1px solid #dee2e6;
	border-radius: 8px;
}

.card-body {
	padding: 1.5rem;
}

.badge {
	padding: 0.5em 0.8em;
}

@media (max-width: 768px) {
	.container {
		padding: 1rem;
	}

	.nav-tabs {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
	}

	.d-flex {
		flex-wrap: wrap;
	}

	.btn {
		margin-bottom: 0.5rem;
	}
}
</style>