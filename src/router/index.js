// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Plantilla from "../views/Plantilla.vue";
import Login from "@/views/Login.vue";
import CrearVotacion from "@/views/CrearVotacion.vue";
import VistaPreeliminar from "@/views/VistaPreeliminar.vue";
import Enlace from "@/views/Enlace.vue";
import Resultados from "@/views/Resultados.vue";
import EncuestasRealizadas from "@/views/EncuestasRealizadas.vue";
import Votacion from "@/views/Votacion.vue";

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
  },
  {
    path: "/votacion/:uuid",
    name: "votacion",
    component: Votacion,
    meta: { public: true, allowAny: true } // allowAny permite acceso sin importar el estado de autenticación
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.checkAuth();

  // Si la ruta permite cualquier acceso (como la votación)
  if (to.meta.allowAny) {
    next();
    return;
  }

  // Si requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  // Si es ruta pública y está autenticado
  if (to.meta.public && isAuthenticated) {
    next({ name: 'plantillas' });
    return;
  }

  // En cualquier otro caso, permitir la navegación
  next();
});

export default router;