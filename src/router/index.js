import { createRouter, createWebHistory } from "vue-router";
import Plantilla from "../views/Plantilla.vue";
import Login from "@/views/Login.vue";
import CrearVotacion from "@/views/CrearVotacion.vue";
import VistaPreeliminar from "@/views/VistaPreeliminar.vue";
import Enlace from "@/views/Enlace.vue";
import Resultados from "@/views/Resultados.vue";
import EncuestasRealizadas from "@/views/EncuestasRealizadas.vue"
// import { authStore } from "../stores/auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path: "/",
      name: "home",
      component: Login  
    },
    {
      path: "/plantillas",
      name: "plantillas",
      component: Plantilla
    },
    {
      path:"/crear-votacion",
      name:"crear-votacion",
      component:CrearVotacion
    },
    {
      path:"/preeliminar",
      name:"preeliminar",
      component:VistaPreeliminar
    },
    {
      path:"/compartir",
      name:"compartir",
      component:Enlace
    },
    {
      path:"/resultados",
      name:"resultados",
      component:Resultados
    },
    {
      path:"/encuestas-realizadas",
      name:"encuestas-realizadas",
      component:EncuestasRealizadas
    }


  ]
});

// router.beforeEach((to, from, next)=>{
//   const store = authStore();
//   if(store.token){
//     const {exp}=store.dectok;
//     var currentTime =Date.now()/1000;
//     if (exp<currentTime){
//       store.token="";
//       store.avatar="";
//       next({name: "login"});
//       }
//   }
//   if(!store.active()&& to.name !== "login"){
//     store.token="";
//     store.avatar="";
//     next({name: "login"});
//   }
//   else{
//     next();
//   }
// });

export default router;