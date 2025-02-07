// CrearVotacion.vue
<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';
import mockPlantillas from '../assets/mocks/plantillas.json';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const selectedTemplate = ref(null);
const inputImageRef = ref(null);
const currentEditingIndex = ref(null);

onMounted(() => {
	// Si venimos de vista preliminar y ya existe una encuesta, mantener el estado
	if (surveyStore.isEditing && surveyStore.currentSurvey.uuid) {
		selectedTemplate.value = {
			title: surveyStore.currentSurvey.name,
			icon: surveyStore.currentSurvey.icon
		};
		return;
	}

	const { template = "" } = route.query;

	if (template == 0) {
		selectedTemplate.value = {
			"title": "Encuesta libre",
			"icon": "twemoji:writing-hand",
			"opciones": []
		};
		surveyStore.initializeFromTemplate(selectedTemplate.value);
	} else {
		const plantilla = mockPlantillas.rows.find((p) => p.id == template);
		if (plantilla) {
			selectedTemplate.value = plantilla;
			surveyStore.initializeFromTemplate(plantilla);
		}
	}
});

async function handleImageUpload(event, index) {
	const file = event.target.files[0];
	if (!file) return;

	// Validar tipo de archivo y tamaño
	if (!file.type.startsWith('image/')) {
		alert('Por favor sube solo imágenes');
		return;
	}

	if (file.size > 5000000) { // 5MB limit
		alert('La imagen debe ser menor a 5MB');
		return;
	}

	try {
		// Convertir imagen a Base64
		const reader = new FileReader();
		reader.onload = (e) => {
			const choices = [...surveyStore.currentSurvey.choices];
			choices[index] = {
				...choices[index],
				image: e.target.result
			};
			surveyStore.updateCurrentSurvey('choices', choices);
		};
		reader.readAsDataURL(file);
	} catch (error) {
		console.error('Error al procesar la imagen:', error);
		alert('Error al procesar la imagen');
	}
}

function removeImage(index) {
	const choices = [...surveyStore.currentSurvey.choices];
	choices[index] = {
		...choices[index],
		image: null
	};
	surveyStore.updateCurrentSurvey('choices', choices);
}

async function preeliminar() {
	try {
		const surveyId = await surveyStore.saveSurvey();
		router.push({
			name: "preeliminar",
			query: { survey: surveyId }
		});
	} catch (error) {
		console.error('Error al guardar la encuesta:', error);
	}
}

function onAddResponse() {
	surveyStore.addChoice();
}

function onDelResponse(index) {
	surveyStore.removeChoice(index);
}

function updateSurveyName(event) {
	surveyStore.updateCurrentSurvey('name', event.target.value);
}

function updateChoiceTitle(index, event) {
	const choices = [...surveyStore.currentSurvey.choices];
	choices[index].title = event.target.value;
	surveyStore.updateCurrentSurvey('choices', choices);
}

function cancelar() {
	surveyStore.clearCurrentSurvey();
	router.push({ name: 'plantillas' });
}

function triggerImageUpload(index) {
	currentEditingIndex.value = index;
	inputImageRef.value.click();
}
</script>

<template>
	<div class="container my-4 p-4 border rounded-3">
		<!-- Input oculto para subir imágenes -->
		<input type="file" ref="inputImageRef" @change="(e) => handleImageUpload(e, currentEditingIndex)" accept="image/*"
			class="d-none">

		<!-- Título de la encuesta -->
		<div v-if="selectedTemplate" class="d-flex justify-content-start align-items-center mb-4">
			<iconify-icon :icon="surveyStore.currentSurvey.icon" class="me-2" width="40" />
			<input class="ps-3 fw-bold form-control form-control-lg" :value="surveyStore.currentSurvey.name"
				@input="updateSurveyName" placeholder="Título de la encuesta" />
		</div>

		<!-- Opciones de respuesta -->
		<div v-if="selectedTemplate" class="mb-3 p-4 bg-light border rounded-3">
			<div v-for="(opcion, index) in surveyStore.currentSurvey.choices" :key="index"
				class="choice-item mb-3 p-3 border rounded bg-white">
				<div class="d-flex align-items-start">
					<!-- Imagen de la opción -->
					<div class="image-container me-3">
						<div v-if="opcion.image" class="position-relative">
							<img :src="opcion.image" alt="Opción" class="option-image rounded" @click="triggerImageUpload(index)">
							<button class="btn btn-sm btn-danger position-absolute top-0 end-0" @click="removeImage(index)">
								<iconify-icon icon="mdi:close" />
							</button>
						</div>
						<button v-else class="btn btn-outline-primary image-placeholder" @click="triggerImageUpload(index)">
							<iconify-icon icon="mdi:image-plus" width="24" />
							<span class="d-block small">Agregar imagen</span>
						</button>
					</div>

					<!-- Input de texto -->
					<input type="text" class="form-control" :value="opcion.title" @input="(e) => updateChoiceTitle(index, e)"
						placeholder="Escribe una opción">

					<!-- Botón eliminar -->
					<button class="btn btn-link text-danger ms-2" @click="onDelResponse(index)">
						<iconify-icon icon="mdi:trash" width="20" />
					</button>
				</div>
			</div>

			<!-- Botón agregar opción -->
			<button class="btn btn-primary d-flex align-items-center" @click="onAddResponse">
				<iconify-icon icon="mdi:plus" class="me-1" />
				Agregar opción
			</button>
		</div>

		<!-- Botones de acción -->
		<div class="d-flex justify-content-end mt-4">
			<button class="btn btn-secondary me-2" @click="cancelar">
				Cancelar
			</button>
			<button class="btn btn-primary" @click="preeliminar" :disabled="surveyStore.loading">
				{{ surveyStore.loading ? 'Guardando...' : 'Vista preliminar' }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.container {
	max-width: 800px;
}

.choice-item {
	transition: all 0.2s ease;
}

.choice-item:hover {
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-container {
	width: 100px;
	height: 100px;
	flex-shrink: 0;
}

.option-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	cursor: pointer;
}

.image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px dashed #dee2e6;
}

.image-placeholder:hover {
	background-color: #f8f9fa;
}
</style>