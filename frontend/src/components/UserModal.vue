<script setup>
import { ref, watch } from 'vue';
import Swal from 'sweetalert2'; // Importación añadida

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  user: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
});

const showPassword = ref(false);

watch(() => props.user, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name || '',
      email: newVal.email || '',
      role: newVal.role || '',
      password: newVal.password || '',
      confirmPassword: newVal.password || ''
    };
  } else {
    form.value = { name: '', email: '', role: '', password: '', confirmPassword: '' };
  }
  showPassword.value = false;
}, { immediate: true });

const handleSubmit = () => {
  // 1. Validación de campos obligatorios vacíos con SweetAlert2
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.role || !form.value.password.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos requeridos (*).',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  // 2. Validación de coincidencia de contraseña con SweetAlert2
  if (form.value.password !== form.value.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error de coincidencia',
      text: 'Las contraseñas ingresadas no coinciden. Por favor, verifícalas.',
      confirmButtonColor: '#ef4444'
    });
    return;
  }

  emit('save', { ...form.value });
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
    <div class="fixed inset-0 bg-black opacity-50" @click="emit('close')"></div>

    <div class="relative w-full max-w-lg mx-auto my-6 z-50 p-4">
      <div class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg">
        
        <div class="flex items-start justify-between p-5 border-b border-slate-200">
          <h3 class="text-xl font-semibold text-slate-800">
            {{ user ? 'Editar Usuario' : 'Agregar Nuevo Usuario' }}
          </h3>
          <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 text-2xl font-semibold">×</button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="relative p-6 flex-auto space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
              <input v-model="form.name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico *</label>
              <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Rol en el Sistema *</label>
              <select v-model="form.role" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required>
                <option value="" disabled>Seleccione un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Ingeniero Residente">Ingeniero Residente</option>
                <option value="Supervisor de Obra">Supervisor de Obra</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña *</label>
                <div class="relative">
                  <input 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path v-unless="showPassword" stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Repetir Contraseña *</label>
                <input 
                  v-model="form.confirmPassword" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
            </div>

          </div>

          <div class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b space-x-3">
            <button type="button" @click="emit('close')" class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium rounded-md text-sm">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md text-sm shadow">Guardar</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>