<script setup>
const emit = defineEmits(["clickTemplate"]);
const props = defineProps({
	label: {
		type: String,
		default: "Plantilla default",
		required: true
	},
	iconButton: {
		type: String,
		default: "noto:beaver",
		required: true
	}

});
</script>
<template>
	<div class="col-md-4 mb-4" @click.prevent="emit('clickTemplate')">
		<div style="height: 200px;" class="p-4 bg-primary rounded-3">
			<iconify-icon width="80" :icon="props.iconButton"/>
			<p class="text-white">{{ props.label }}</p>
		</div>
	</div>
</template>