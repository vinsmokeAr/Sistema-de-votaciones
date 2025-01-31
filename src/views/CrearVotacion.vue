<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from "vue-router";
import mockPlantillas from '../assets/mocks/plantillas.json';

const route = useRoute();
const router = useRouter();

const plantillasRows = computed(() => {
	const { rows = [] } = mockPlantillas;
	return rows;
});

const selectedTemplate = ref(null);

onMounted(() => {
	const { template = "" } = route.query;
	console.log('template: ', template);
	if(template == 0){
		selectedTemplate.value = {
   "title": "Encuesta libre",
   "icon": "twemoji:writing-hand",
   "opciones": [
    {
     "title": "Opción 1",
     "image": "/src/assets/images/opc.jpg",
     "votes": 0
    }
   ]
  };
	}else{
		selectedTemplate.value = plantillasRows.value.find((p) => p.id == template) || plantillasRows.value[0];
	}
	console.log('Selected Template:', selectedTemplate.value);
});

function preeliminar() {
	router.push({ name: "preeliminar" });
}

function onAddResponse() {
	selectedTemplate.value?.opciones.push({
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
</script>

<template>
	<div class="container my-4 p-4 border rounded-3">
		<div v-if="selectedTemplate" class="d-flex justify-content-start align-items-center mb-3">
			<iconify-icon :icon="selectedTemplate.icon" class="me-1" width="40" />
			<input class="ps-3 fw-bold form-control" :value="selectedTemplate.title"/>
		</div>

		<div v-if="selectedTemplate" class="mb-3 p-3 bg-light border rounded-3">
			<li v-for="(opcion, index) in selectedTemplate.opciones" :key="index"
				class="d-flex hover align-items-center mb-2">
				<img :src="opcion.image" alt="Opción" class="p-2" style="width: 40px; height: 40px;" />
				<input type="text" class="form-control" :value="opcion.title">
				<!-- <span class="ms-auto badge bg-secondary">{{ opcion.votes }}</span> -->
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
			<button class="btn btn-primary" @click.prevent="preeliminar">Siguiente</button>
		</div>
	</div>
</template>

<style scoped>
.container {
	max-width: 700px;
}
</style>
