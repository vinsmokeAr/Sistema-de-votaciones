<script setup>
</script>
<template>
	<div class="container my-5 p-4 bg-light rounded-3">
		<!-- Título de la sección -->
		<h5 class="fw-bold">Edición</h5>

		<!-- Campo de pregunta -->
		<div class="mb-3">
			<label for="pregunta" class="form-label">¿Qué quieres preguntar?</label>
			<textarea class="form-control" id="pregunta" rows="2"></textarea>
		</div>

		<!-- Lista de opciones -->
		<div class="d-flex justify-content-between">
			<p class="fw-bold">Opciones</p>
			<p class="fw-bold">Eliminar</p>
		</div>

		<!-- Opciones dinámicas -->
		<div id="opciones">
			<div class="d-flex align-items-center mb-2">
				<input type="radio" name="opcion" class="form-check-input me-2">
				<input type="text" class="form-control me-2" value="kira" readonly>
				<button type="button" class="btn btn-link text-danger p-0" onclick="eliminarOpcion(this)">✖</button>
			</div>
			<div class="d-flex align-items-center mb-2">
				<input type="radio" name="opcion" class="form-check-input me-2">
				<input type="text" class="form-control me-2" value="puc" readonly>
				<button type="button" class="btn btn-link text-danger p-0" onclick="eliminarOpcion(this)">✖</button>
			</div>
			<div class="d-flex align-items-center mb-2">
				<input type="radio" name="opcion" class="form-check-input me-2">
				<input type="text" class="form-control me-2" value="carisa" readonly>
				<button type="button" class="btn btn-link text-danger p-0" onclick="eliminarOpcion(this)">✖</button>
			</div>
			<div class="d-flex align-items-center mb-2">
				<input type="radio" name="opcion" class="form-check-input me-2">
				<input type="text" class="form-control me-2" placeholder="Nueva opción">
				<button type="button" class="btn btn-link text-danger p-0" onclick="eliminarOpcion(this)">✖</button>
			</div>
		</div>

		<!-- Botón para añadir opciones -->
		<button type="button" class="btn btn-primary btn-sm mt-2" onclick="agregarOpcion()">+</button>

		<!-- Botones de acción -->
		<div class="d-flex justify-content-end mt-4">
			<button type="button" class="btn btn-secondary me-2">Cancelar</button>
			<button type="button" class="btn btn-primary">Aceptar</button>
		</div>
	</div>
</template>