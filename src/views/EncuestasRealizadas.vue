<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();

const encuestasAnteriores = ref([
  {
    id: 1,
    titulo: "Nombre de la votación",
    fecha: "2023-10-15",
    participantes: 150,
    estado: "Finalizada",
    votos: 120
  },
  {
    id: 2,
    titulo: "Nombre de la votación",
    fecha: "2023-09-28",
    participantes: 200,
    estado: "Finalizada",
    votos: 180
  },
  {
    id: 3,
    titulo: "Nombre de la votación",
    fecha: "2023-09-10",
    participantes: 300,
    estado: "Finalizada",
    votos: 250
  },
  {
    id: 4,
    titulo: "Nombre de la votación",
    fecha: "2023-08-25",
    participantes: 180,
    estado: "Finalizada",
    votos: 160
  }
]);

function verEnlace() {
  router.push({name:"compartir"});
}

function regresarResult(){
  router.push({name:"resultados"});
} 
</script>

<template>
  <div class="container my-5 bg-light rounded-3">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="text-primary">Encuestas Anteriores</h3>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="row mb-4">
      <!-- Total Encuestas -->
      <div class="col-md-4 mb-4">
        <div class="card border-left-primary h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="small font-weight-bold text-primary text-uppercase mb-1">
                  Total Encuestas
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ encuestasAnteriores.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Participantes -->
      <div class="col-md-4 mb-4">
        <div class="card border-left-warning h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="small font-weight-bold text-warning text-uppercase mb-1">
                  Total Participantes
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ encuestasAnteriores.reduce((sum, e) => sum + e.participantes, 0) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Votos -->
      <div class="col-md-4 mb-4">
        <div class="card border-left-danger h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="small font-weight-bold text-danger text-uppercase mb-1">
                  Total Votos
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ encuestasAnteriores.reduce((sum, e) => sum + e.votos, 0) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de encuestas -->
    <div class="card mb-4">
      <div class="card-header bg-primary">
        <h6 class="m-0 font-weight-bold text-white">Listado de Encuestas</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha</th>
                <th>Participantes</th>
                <th>Votos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="encuesta in encuestasAnteriores" :key="encuesta.id">
                <td>{{ encuesta.titulo }}</td>
                <td>{{ new Date(encuesta.fecha).toLocaleDateString() }}</td>
                <td>{{ encuesta.participantes }}</td>
                <td>{{ encuesta.votos }}</td>
                <td>
                  <span class="badge bg-success">{{ encuesta.estado }}</span>
                </td>
                <td>
                  <div class="btn-group">
                    <button @click="verEnlace(encuesta.id)" class="btn btn-sm btn-primary">
                      Ver enlace
                    </button>
                    <button @click="regresarResult()" class="btn btn-sm btn-warning">
                      Resultados
                    </button>
                    <button class="btn btn-sm btn-light">
                      Activar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-left-primary {
  border-left: 4px solid var(--primary);
}

.border-left-warning {
  border-left: 4px solid var(--warning);
}

.border-left-danger {
  border-left: 4px solid var(--danger);
}

.card {
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
}

.btn-group .btn {
  margin: 0 2px;
}

.table td, .table th {
  vertical-align: middle;
}

.badge {
  padding: 0.5em 0.8em;
}

.small {
  font-size: 0.875rem;
}
</style>