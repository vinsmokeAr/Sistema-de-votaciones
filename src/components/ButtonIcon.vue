<script setup>
const emit = defineEmits(["onClick"]);
</script>

<template>
  <button type="button" class="btn" @click.prevent="emit('onClick', $event)">
    <slot></slot>
  </button>
</template>

<style scoped>
:deep(iconify-icon) {
  vertical-align: middle;
}
</style>
