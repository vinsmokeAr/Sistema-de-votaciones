import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Plantilla from "../views/Plantilla.vue";
import Login from "@/views/Login.vue";
import CrearVotacion from "@/views/CrearVotacion.vue";
import VistaPreeliminar from "@/views/VistaPreeliminar.vue";
import Enlace from "@/views/Enlace.vue";
import Resultados from "@/views/Resultados.vue";
import EncuestasRealizadas from "@/views/EncuestasRealizadas.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Login,
    meta: { public: true }
  },
  {
    path: "/plantillas",
    name: "plantillas",
    component: Plantilla,
    meta: { requiresAuth: true }
  },
  {
    path: "/crear-votacion",
    name: "crear-votacion",
    component: CrearVotacion,
    meta: { requiresAuth: true }
  },
  {
    path: "/preeliminar",
    name: "preeliminar",
    component: VistaPreeliminar,
    meta: { requiresAuth: true }
  },
  {
    path: "/compartir",
    name: "compartir",
    component: Enlace,
    meta: { requiresAuth: true }
  },
  {
    path: "/resultados",
    name: "resultados",
    component: Resultados,
    meta: { requiresAuth: true }
  },
  {
    path: "/encuestas-realizadas",
    name: "encuestas-realizadas",
    component: EncuestasRealizadas,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'home' });
  } else if (to.meta.public && isAuthenticated) {
    next({ name: 'plantillas' });
  } else {
    next();
  }
});

export default router;