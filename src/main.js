import { createApp } from 'vue';
import '@/assets/css/style.css';
import App from './App.vue';
import { createPinia } from 'pinia';

import router from "./router";
const app = createApp(App);
app.use(createPinia());

// import {routeStore } from "@/stores/routes";
app.use(router);


app.mount('#app');
