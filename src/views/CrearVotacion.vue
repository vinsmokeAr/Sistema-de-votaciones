<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { useSurveyStore } from '../stores/survey';
import mockPlantillas from '../assets/mocks/plantillas.json';
import EmojiPicker from '../components/EmojiPicker.vue';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

const plantillasRows = computed(() => {
	const { rows = [] } = mockPlantillas;
	return rows;
});

const selectedTemplate = ref(null);
const selectedEmoji = ref('twemoji:writing-hand');
const title = ref('');
const error = ref('');

onMounted(() => {
	const { template = "" } = route.query;
	if (template == 0) {
		selectedTemplate.value = {
			"title": "Encuesta libre",
			"icon": selectedEmoji.value,
			"opciones": [
				{
					"title": "Opción 1",
					"image": "/src/assets/images/opc.jpg",
					"votes": 0
				}
			]
		};
	} else {
		selectedTemplate.value = plantillasRows.value.find((p) => p.id == template) || plantillasRows.value[0];
		if (selectedTemplate.value) {
			selectedEmoji.value = selectedTemplate.value.icon;
			title.value = selectedTemplate.value.title;
		}
	}
});

function onEmojiSelect(emoji) {
	selectedEmoji.value = emoji;
	if (selectedTemplate.value) {
		selectedTemplate.value.icon = emoji;
	}
}

async function preeliminar() {
	try {
		if (!title.value.trim()) {
			error.value = 'Por favor, ingrese un título para la encuesta';
			return;
		}

		if (!selectedTemplate.value.opciones.length) {
			error.value = 'Debe agregar al menos una opción';
			return;
		}

		// Preparar datos de la encuesta
		const surveyData = {
			title: title.value,
			icon: selectedEmoji.value,
			choices: selectedTemplate.value.opciones.map(opt => ({
				title: opt.title,
				image: opt.image
			}))
		};

		// Crear la encuesta
		const newSurvey = await surveyStore.createSurvey(surveyData);

		// Navegar a la vista preliminar con el UUID de la encuesta
		router.push({
			name: "preeliminar",
			query: {
				survey: newSurvey.uuid
			}
		});
	} catch (err) {
		error.value = err.toString();
	}
}

function onAddResponse() {
	if (!selectedTemplate.value) return;

	selectedTemplate.value.opciones.push({
		"title": "Nueva respuesta",
		"image": "/src/assets/images/opc.jpg",
		"votes": 0
	});
}

function onDelResponse(index) {
	const opc = selectedTemplate.value?.opciones;
	if (index >= 0 && index < opc.length) {
		opc.splice(index, 1);
	}
}

function updateOptionTitle(index, newTitle) {
	if (selectedTemplate.value && selectedTemplate.value.opciones[index]) {
		selectedTemplate.value.opciones[index].title = newTitle;
	}
}
</script>

<template>
	<div class="container my-4 p-4 border rounded-3">
		<div v-if="error" class="alert alert-danger">{{ error }}</div>

		<div v-if="selectedTemplate" class="d-flex justify-content-start align-items-center mb-3">
			<EmojiPicker :emoji="selectedEmoji" @on-click="onEmojiSelect" />
			<input class="ps-3 fw-bold form-control" v-model="title" placeholder="Título de la encuesta" />
		</div>

		<div v-if="selectedTemplate" class="mb-3 p-3 bg-light border rounded-3">
			<li v-for="(opcion, index) in selectedTemplate.opciones" :key="index"
				class="d-flex hover align-items-center mb-2">
				<img :src="opcion.image" alt="Opción" class="p-2" style="width: 40px; height: 40px;" />
				<input type="text" class="form-control" v-model="opcion.title"
					@input="updateOptionTitle(index, $event.target.value)">
				<button class="ms-auto btn btn-link text-danger float-end" @click.prevent="onDelResponse(index)"
					:disabled="selectedTemplate.opciones.length <= 1">
					<iconify-icon icon="mdi:trash" />
				</button>
			</li>

			<div class="btn-group">
				<button class="btn btn-primary float-end d-flex align-items-center" @click.prevent="onAddResponse">
					<iconify-icon icon="mdi:add" />
					<span class="ps-2 d-none d-lg-inline">Agregar respuesta</span>
				</button>
			</div>
		</div>

		<div class="d-flex justify-content-end mt-4">
			<button class="btn btn-primary" @click.prevent="preeliminar">
				Siguiente
			</button>
		</div>
	</div>
</template>

<style scoped>
.container {
	max-width: 700px;
}

li {
	list-style: none;
}

.hover:hover {
	background-color: rgba(0, 0, 0, 0.05);
	border-radius: 0.375rem;
}
</style>