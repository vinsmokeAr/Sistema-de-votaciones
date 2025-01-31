import { ref } from "vue";
import { defineStore } from "pinia";

export const routeStore = defineStore("routes", () => {
  function addRoute(r){
    routeStore.value.push(r);
  }
  function existsRoute(r){
    if(r==="/"){
      return true;
    }
    if (!r.startsWith("/")){
      return false;
    }
    for (const i in routes.value){
      if(routes.value[i].path === r){
        return true;
      }
    }
    return false;
  }

  const routes = ref ([]);
  return { routes, addRoute, existsRoute};
});