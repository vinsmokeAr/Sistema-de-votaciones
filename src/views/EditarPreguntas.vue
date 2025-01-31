<script setup>
</script>

<template>
	<div class="container my-4 p-4 bg-light rounded-3">
		<!-- Sección de página con preguntas -->
		<div class="mb-3 p-3 border rounded-3 bg-primary bg-opacity-10">
			<!-- Cabecera de la página -->
			<div class="d-flex align-items-center justify-content-between mb-3">
				<div class="d-flex align-items-center">
					<span class="badge bg-primary rounded-circle me-2">1</span>
					<input type="text" class="form-control" placeholder="Escribe el título de la página aquí">
				</div>
				<div>
					<button class="btn btn-link p-0 me-2"><i class="bi bi-pencil"></i></button>
					<button class="btn btn-link p-0 me-2"><i class="bi bi-eye"></i></button>
				</div>
			</div>

			<!-- Pregunta -->
			<div class="p-3 border rounded-3 bg-white mb-3">
				<p class="fw-bold mb-1">opr quien votas</p>
				<div class="mb-2">
					<div class="form-check">
						<input type="radio" class="form-check-input" name="opcion1" id="opcion1-1">
						<label class="form-check-label" for="opcion1-1">kira</label>
					</div>
					<div class="form-check">
						<input type="radio" class="form-check-input" name="opcion1" id="opcion1-2">
						<label class="form-check-label" for="opcion1-2">puc</label>
					</div>
					<div class="form-check">
						<input type="radio" class="form-check-input" name="opcion1" id="opcion1-3">
						<label class="form-check-label" for="opcion1-3">carisia</label>
					</div>
				</div>
				<button class="btn btn-link">Añadir pregunta</button>
				<button class="btn btn-link">Añadir elemento</button>
			</div>

			<!-- Botón de fusión de páginas -->
			<button class="btn btn-light btn-sm mb-3"><i class="bi bi-arrows-angle-contract"></i> Fusionar páginas</button>

			<!-- Botón de añadir página -->
			<button class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> Añadir página</button>
		</div>

		<!-- Sección para otra página -->
		<div class="mb-3 p-3 border rounded-3 bg-primary bg-opacity-10">
			<div class="d-flex align-items-center justify-content-between mb-3">
				<div class="d-flex align-items-center">
					<span class="badge bg-primary rounded-circle me-2">2</span>
					<input type="text" class="form-control" placeholder="Escribe el título de la página aquí">
				</div>
				<div>
					<button class="btn btn-link p-0 me-2"><i class="bi bi-pencil"></i></button>
					<button class="btn btn-link p-0 me-2"><i class="bi bi-eye"></i></button>
				</div>
			</div>

			<button class="btn btn-link">Añadir pregunta</button>
			<button class="btn btn-link">Añadir elemento</button>
			<button class="btn btn-light btn-sm mb-3"><i class="bi bi-arrows-angle-contract"></i> Fusionar páginas</button>
			<button class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> Añadir página</button>
		</div>

		<!-- Botón de siguiente -->
		<div class="text-end mt-4">
			<button class="btn btn-primary">Siguiente</button>
		</div>
	</div>
</template>