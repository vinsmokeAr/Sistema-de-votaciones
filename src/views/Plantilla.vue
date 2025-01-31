<script setup>
import TemplateButton from '../components/TemplateButton.vue';
import {useRouter} from 'vue-router';
import mockPlantillas from '../assets/mocks/plantillas.json';
import {computed} from 'vue';

const router = useRouter();

const plantillasRows = computed(()=>{
	const { rows = [] } = mockPlantillas;
	return rows;
});

function onClickTemplate(template){
  router.push({name: "crear-votacion", query: { template }});
}

function onClickResult(template){
  router.push({name:"encuestas-realizadas", query:{template}});
}

</script>
<template>
	<div class="container my-5 p-4 bg-light rounded-3">
		<div class="row text-center">
			<TemplateButton label="Crear una votación desde cero." icon-button="twemoji:writing-hand" 
			@click-template="onClickTemplate('0')"/>
			
			<TemplateButton v-for="plantilla in plantillasRows" :label="plantilla.title" :icon-button="plantilla.icon" 
      @click-template="onClickTemplate(plantilla.id)"/>
			<!-- <TemplateButton label="Plantilla 3" icon-button="twemoji:pencil" />
			<TemplateButton label="Plantilla 4" icon-button="twemoji:check-mark-button" />
			<TemplateButton label="Resultados de encuestas anteriores."
				icon-button="twemoji:man-office-worker-medium-dark-skin-tone" /> -->
      <TemplateButton label="Ver resultados de votaciones realizadas." icon-button="twemoji:writing-hand" 
      @click-template="onClickResult"/>
		</div>
	</div>
</template>
<style scoped></style>