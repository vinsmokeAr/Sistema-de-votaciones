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

onMounted(() => {
	const { template = "" } = route.query;

	if (template == 0) {
		selectedTemplate.value = {
			"title": "Encuesta libre",
			"icon": "twemoji:writing-hand",
			"opciones": []
		};
		// Inicializar store con template vacío
		surveyStore.updateCurrentSurvey('name', 'Nueva Encuesta');
		surveyStore.updateCurrentSurvey('icon', 'twemoji:writing-hand');
	} else {
		const plantilla = mockPlantillas.rows.find((p) => p.id == template);
		if (plantilla) {
			selectedTemplate.value = plantilla;
			// Inicializar store con datos de la plantilla
			surveyStore.updateCurrentSurvey('name', plantilla.title);
			surveyStore.updateCurrentSurvey('icon', plantilla.icon);
			plantilla.opciones.forEach(opcion => {
				surveyStore.addChoice({
					title: opcion.title,
					image: opcion.image
				});
			});
		}
	}
});

async function preeliminar() {
	try {
		// Guardar encuesta antes de ir a vista preliminar
		const surveyId = await surveyStore.saveSurvey();
		router.push({
			name: "preeliminar",
			query: { survey: surveyId }
		});
	} catch (error) {
		console.error('Error al guardar la encuesta:', error);
		// Aquí podrías mostrar un mensaje de error al usuario
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
</script>

<template>
	<div class="container my-4 p-4 border rounded-3">
		<div v-if="selectedTemplate" class="d-flex justify-content-start align-items-center mb-3">
			<iconify-icon :icon="surveyStore.currentSurvey.icon" class="me-1" width="40" />
			<input class="ps-3 fw-bold form-control" :value="surveyStore.currentSurvey.name" @input="updateSurveyName"
				placeholder="Título de la encuesta" />
		</div>

		<div v-if="selectedTemplate" class="mb-3 p-3 bg-light border rounded-3">
			<li v-for="(opcion, index) in surveyStore.currentSurvey.choices" :key="index"
				class="d-flex hover align-items-center mb-2">
				<img :src="opcion.image" alt="Opción" class="p-2" style="width: 40px; height: 40px;" />
				<input type="text" class="form-control" :value="opcion.title" @input="(e) => updateChoiceTitle(index, e)">
				<button class="ms-auto btn btn-link text-danger float-end" @click.prevent="onDelResponse(index)">
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
			<button class="btn btn-primary" @click.prevent="preeliminar" :disabled="surveyStore.loading">
				{{ surveyStore.loading ? 'Guardando...' : 'Siguiente' }}
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
</style>