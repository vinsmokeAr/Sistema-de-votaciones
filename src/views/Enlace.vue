// Enlace.vue
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const surveyUrl = ref('');
const copySuccess = ref(false);
const survey = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
	const { survey: surveyId = "" } = route.query;
	if (!surveyId) {
		router.push({ name: "preeliminar" });
		return;
	}

	try {
		survey.value = await surveyStore.getSurvey(surveyId);
		surveyUrl.value = `${window.location.origin}/votacion/${surveyId}`;
		loading.value = false;
	} catch (err) {
		error.value = 'Error al cargar la encuesta';
		loading.value = false;
	}
});

async function copiarEnlace() {
	try {
		await navigator.clipboard.writeText(surveyUrl.value);
		copySuccess.value = true;
		setTimeout(() => {
			copySuccess.value = false;
		}, 2000);
	} catch (err) {
		console.error('Error al copiar:', err);
	}
}

function regresarPreeliminar() {
	router.push({
		name: "preeliminar",
		query: { survey: route.query.survey }
	});
}

function irAResultados() {
	router.push({
		name: "resultados",
		query: { survey: route.query.survey }
	});
}

async function compartirWhatsapp() {
	const text = encodeURIComponent(`¡Te invito a participar en mi encuesta "${survey.value.name}"!\n${surveyUrl.value}`);
	window.open(`https://wa.me/?text=${text}`, '_blank');
}

async function compartirEmail() {
	const subject = encodeURIComponent(`Participa en mi encuesta: ${survey.value.name}`);
	const body = encodeURIComponent(`¡Hola!\n\nTe invito a participar en mi encuesta "${survey.value.name}".\n\nPuedes acceder aquí: ${surveyUrl.value}`);
	window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}
</script>

<template>
	<div class="container my-5">
		<!-- Barra de progreso -->
		<div class="progress-container mb-4">
			<div class="d-flex justify-content-between align-items-center">
				<div class="progress flex-grow-1 mx-3">
					<div class="progress-bar" role="progressbar" style="width: 100%"></div>
				</div>
			</div>
			<div class="d-flex justify-content-between mt-2 text-muted small">
				<span>Crear</span>
				<span>Vista previa</span>
				<span class="text-primary fw-bold">Compartir</span>
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

				<!-- Content -->
				<div v-else class="share-content">
					<!-- Encabezado -->
					<div class="d-flex align-items-center mb-4">
						<iconify-icon :icon="survey.icon" width="40" height="40" class="me-3" />
						<div>
							<h2 class="mb-1">{{ survey.name }}</h2>
							<p class="text-muted mb-0">Comparte tu encuesta</p>
						</div>
					</div>

					<!-- Enlaces de compartir -->
					<div class="share-section mb-4">
						<label class="form-label fw-bold">Enlace directo</label>
						<div class="input-group mb-3">
							<input type="text" class="form-control" :value="surveyUrl" readonly aria-label="URL de la encuesta">
							<button class="btn btn-primary" type="button" @click="copiarEnlace"
								:class="{ 'btn-success': copySuccess }">
								<iconify-icon :icon="copySuccess ? 'mdi:check' : 'mdi:content-copy'" class="me-1" />
								{{ copySuccess ? '¡Copiado!' : 'Copiar' }}
							</button>
						</div>

						<!-- Código QR -->
						<div class="qr-section text-center mb-4">
							<p class="text-muted mb-2">Código QR</p>
							<div class="qr-container mx-auto">
								<img
									:src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(surveyUrl)}`"
									alt="QR Code" class="img-fluid rounded shadow-sm" />
							</div>
						</div>

						<!-- Botones de compartir -->
						<div class="share-buttons">
							<p class="fw-bold mb-3">Compartir en redes sociales</p>
							<div class="d-grid gap-2">
								<button class="btn btn-outline-success d-flex align-items-center justify-content-center"
									@click="compartirWhatsapp">
									<iconify-icon icon="mdi:whatsapp" class="me-2" width="20" />
									Compartir por WhatsApp
								</button>
								<button class="btn btn-outline-primary d-flex align-items-center justify-content-center"
									@click="compartirEmail">
									<iconify-icon icon="mdi:email" class="me-2" width="20" />
									Compartir por correo
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Botones de acción -->
		<div class="d-flex justify-content-between mt-4">
			<button class="btn btn-outline-primary" @click="regresarPreeliminar">
				<iconify-icon icon="mdi:arrow-left" class="me-1" />
				Regresar
			</button>
			<button class="btn btn-primary" @click="irAResultados">
				Ver resultados
				<iconify-icon icon="mdi:chart-bar" class="ms-1" />
			</button>
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

.share-content {
	max-width: 600px;
	margin: 0 auto;
}

.qr-container {
	max-width: 150px;
	padding: 1rem;
	background-color: white;
	border-radius: 8px;
}

.qr-container img {
	width: 100%;
	height: auto;
}

.share-section {
	background-color: #f8f9fa;
	border-radius: 8px;
	padding: 1.5rem;
}

.share-buttons .btn {
	padding: 0.75rem;
}

/* Animaciones */
.btn-success {
	transition: all 0.3s ease;
}

@media (max-width: 768px) {
	.container {
		padding: 1rem;
	}

	.share-section {
		padding: 1rem;
	}

	.d-flex.justify-content-between {
		flex-direction: column;
		gap: 1rem;
	}

	.btn {
		width: 100%;
	}
}
</style>