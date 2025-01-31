<script setup>
</script>
<template>
      <div class="container my-5 p-4 bg-light rounded-3">
        <!-- Barra de Progreso -->
        <div class="d-flex justify-content-around align-items-center mb-4">
            <div class="text-center">
                <span class="badge bg-primary rounded-circle p-3">1</span>
                <p class="fw-bold text-primary mb-0">Crear</p>
            </div>
            <div class="text-center">
                <span class="badge bg-secondary rounded-circle p-3">2</span>
                <p class="fw-bold mb-0">Ver</p>
            </div>
            <div class="text-center">
                <span class="badge bg-secondary rounded-circle p-3">3</span>
                <p class="fw-bold mb-0">Compartir</p>
            </div>
            <div class="text-center">
                <span class="badge bg-secondary rounded-circle p-3">4</span>
                <p class="fw-bold mb-0">Resultados</p>
            </div>
        </div>

        <!-- Formulario de Creación -->
        <div class="border rounded-3 p-4">
            <div class="mb-3">
                <label for="tituloVotacion" class="form-label">Escribe el título de la votación aquí.</label>
                <input type="text" class="form-control" id="tituloVotacion" placeholder="Escribe el título de la votación aquí.">
            </div>

            <p class="fw-bold">Selecciona una opción.</p>

            <!-- Opciones de Votación -->
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-primary bg-opacity-10 rounded-3 d-flex align-items-center">
                        <input type="radio" name="votacion" id="opcion1" class="form-check-input me-2">
                        <label for="opcion1" class="form-check-label">Elección única</label>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="p-3 bg-primary bg-opacity-10 rounded-3 d-flex align-items-center">
                        <input type="checkbox" id="opcion2" class="form-check-input me-2">
                        <label for="opcion2" class="form-check-label">Elección múltiple</label>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="p-3 border border-primary rounded-3 d-flex align-items-center">
                        <input type="radio" name="votacion" id="opcion3" class="form-check-input me-2">
                        <label for="opcion3" class="form-check-label">Elección única</label>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="p-3 border border-primary rounded-3 d-flex align-items-center">
                        <input type="radio" name="votacion" id="opcion4" class="form-check-input me-2">
                        <label for="opcion4" class="form-check-label">Elección única con imagen</label>
                    </div>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="d-flex justify-content-end mt-4">
                <button type="button" class="btn btn-secondary me-2">Cancelar</button>
                <button type="button" class="btn btn-primary">Aceptar</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>



</template>