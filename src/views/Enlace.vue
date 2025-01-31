<script setup>
import {useRoute} from 'vue-router';
import {watch, onMounted} from 'vue';
import {useRouter} from  "vue-router";

const route = useRoute();
const router = useRouter();

function regresarPreeliminar(){
	router.push({name:"preeliminar"});
}

function resultadosF(){
	router.push({name:"resultados"});
}
</script>
<template>
	<div class="container my-5 p-4 border rounded-3">
		<!-- Título de compartir enlace -->
		<h5 class="fw-bold">Compartir enlace</h5>

		<!-- Campo de enlace con botón para copiar -->
		<div class="input-group my-4">
			<input type="text" class="form-control" value="https://www.votaciones.com/Sistema-de-votaciones" readonly>
			<button class="btn btn-outline-secondary" type="button" onclick="copiarEnlace()">
				<i class="bi bi-clipboard"></i>
				<iconify-icon icon="mi:copy"></iconify-icon>
			</button>
		</div>

		<!-- Botones de Cancelar y Aceptar -->
		<div class="d-flex justify-content-end">
			<button type="button" class="btn btn-secondary me-2"@click.prevent="regresarPreeliminar">Regresar</button>
			<button type="button" class="btn btn-primary"@click.prevent="resultadosF">Aceptar</button>
		</div>
	</div>
</template>