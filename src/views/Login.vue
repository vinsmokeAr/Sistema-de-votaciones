<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function login(){
  router.push({name: "plantillas"});
}
</script>

<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-xl-10 col-lg-12 col-md-9">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <div class="row">
              <!-- Columna de la imagen -->
              <div class="col-lg-6 d-none d-lg-block bg-login-image">
                <img style="height: 100%; width: 100%; object-fit: cover;" src="/src/assets/images/votacionesNueva.jpg" alt="">
              </div>
              <!-- Columna del formulario -->
              <div class="col-lg-6">
                <div class="p-5 d-flex flex-column justify-content-center" style="min-height: 100%;">
                  <div class="text-center mb-4">
                    <h1 class="h4 text-gray-900">Accede al panel de administrador</h1>
                    <small class="text-muted">Ingresa tus credenciales para acceder</small>
                  </div>
                  <form class="user">
                    <div class="form-group mb-3">
                      <input 
                        type="email" 
                        class="form-control form-control-user" 
                        id="exampleInputEmail"
                        aria-describedby="emailHelp" 
                        placeholder="Usuario">
                    </div>
                    <div class="form-group mb-3">
                      <input 
                        type="password" 
                        class="form-control form-control-user" 
                        id="exampleInputPassword"
                        placeholder="Contraseña">
                    </div>
                    <a 
                      href="#" 
                      class="btn btn-primary btn-user btn-block" 
                      @click.prevent="login">
                      Ingresar
                    </a>
                    <hr>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control-user {
  padding: 0.75rem;
  font-size: 0.9rem;
}
</style>