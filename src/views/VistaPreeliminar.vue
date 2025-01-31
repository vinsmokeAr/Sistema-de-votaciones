<script setup>
import {useRoute} from 'vue-router';
import {watch, onMounted} from 'vue';
import {useRouter} from  "vue-router";

const route = useRoute();
const router = useRouter();


onMounted(() => {
    const { hola = "" } = route.query;
    console.log("hola:", hola);

    if (hola === "kira") {
        console.log("es kira");
    } else {
        console.log("no es kira");
    }
});
function regresarOpciones(){
  router.push({name:"crear-votacion"});
}
function compartirEncuesta(){
  router.push({name:"compartir"});
}

</script>

<template>
    <div class="container my-5 p-4 border rounded-3">
        <!-- Título de vista preliminar -->
        <p>Esto es una vista preliminar de tu votación.</p>

        <!-- Título y subtítulo de la pregunta -->
        <h6 class="fw-bold">Nombre de la votación.</h6>
        <p>¿Pregunta?</p>

        <!-- Opciones de votación -->
        <div class="mb-4">
            <div class="form-check">
                <input type="radio" class="form-check-input" name="votacion" id="opcion1">
                <label class="form-check-label" for="opcion1">Opción 1</label>
            </div>
            <div class="form-check">
                <input type="radio" class="form-check-input" name="votacion" id="opcion2">
                <label class="form-check-label" for="opcion2">Opción 2</label>
            </div>
            <div class="form-check">
                <input type="radio" class="form-check-input" name="votacion" id="opcion3">
                <label class="form-check-label" for="opcion3">Opción 3</label>
            </div>
        </div>

        <!-- Botones de Cancelar y Aceptar -->
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" @click.prevent="regresarOpciones">Regresar</button>
            <button type="button" class="btn btn-primary" @click.prevent="compartirEncuesta">Aceptar</button>
        </div>
    </div>
</template>
