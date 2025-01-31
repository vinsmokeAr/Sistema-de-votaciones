<script setup>
import { ref } from "vue";
const num = ref(1);
</script>
<template>
  <div class="container">
    <h1>Pagina principal modificada <br> Creando CI </h1>
    <button class="btn btn-primary" @click="() => { num++; }">
      Picame {{ num }} 
      <iconify-icon class="text-danger" icon="line-md:sunny-outline-twotone-loop"/>
    </button>
  </div>
</template>