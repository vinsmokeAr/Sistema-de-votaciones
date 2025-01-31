<script setup>
import {useRoute} from 'vue-router';
import {watch, onMounted} from 'vue';
import {useRouter} from  "vue-router";

const route = useRoute();
const router = useRouter();

function regresarMenu(){
  router.push({name:"plantillas"});
}

</script>

<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="container p-4 border rounded-3 text-center" style="max-width: 600px;">
          <!-- Título de los resultados -->
          <h5 class="fw-bold mb-4">Resultados de la votación 'Nombre de la votación'</h5>

          <!-- Tarjetas de resultados -->
          <div class="row mb-4">
              <div class="col-md-6 d-flex justify-content-center">
                  <div class="p-3 bg-primary bg-opacity-75 rounded-3 text-center text-white" style="width: 100%;">
                      <h6 class="fw-bold display-6">1</h6>
                      <p class="fw-bold">Total de accesos a la votación</p>
                      <p class="text-white-50">Número de veces que tu encuesta ha sido abierta (con o sin respuesta)</p>
                  </div>
              </div>
              <div class="col-md-6 d-flex justify-content-center">
                  <div class="p-3 bg-primary bg-opacity-75 rounded-3 text-center text-white" style="width: 100%;">
                      <h6 class="fw-bold display-6">1-100%</h6>
                      <p class="fw-bold">Total de respuestas</p>
                      <p class="text-white-50">Cantidad de respuestas que haya tenido la votación</p>
                  </div>
              </div>
          </div>
          
          <!-- Botones de finalizar y regresar al menú principal -->
          <div class="d-flex justify-content-center">
              <button class="btn btn-primary me-3">Finalizar votación.</button>
              <button class="btn btn-secondary" @click.prevent="regresarMenu">Regresar al menú principal</button>
          </div>
      </div>
  </div>
</template>

<style scoped>
.container {
    max-width: 700px;
}

.bg-primary {
    min-height: 150px;
}
</style>