<script setup>
defineProps({
  isOpen: { type: Boolean, required: true },
  user: { type: Object, default: null }
});

const emit = defineEmits(['close']);
</script>

<template>
  <div v-if="isOpen && user" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
    <div class="fixed inset-0 bg-black opacity-50" @click="emit('close')"></div>

    <div class="relative w-full max-w-md mx-auto my-6 z-50 p-4">
      <div class="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none">
        
        <div class="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50 rounded-t">
          <div class="flex items-center space-x-3">
            <span class="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            <h3 class="text-md font-bold text-slate-800">Ficha del Usuario</h3>
          </div>
          <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 text-2xl font-semibold">×</button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre Completo</h4>
            <p class="text-base font-bold text-slate-800">{{ user.name }}</p>
          </div>

          <div>
            <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Correo Electrónico</h4>
            <p class="text-sm font-semibold text-slate-700">{{ user.email }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol de Acceso</h4>
              <span class="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 mt-1">
                {{ user.role }}
              </span>
            </div>

            <!-- Contraseña protegida visualmente -->
            <div>
              <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</h4>
              <p class="text-sm font-bold text-slate-500 font-mono tracking-widest mt-1">••••••••</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50 rounded-b">
          <button @click="emit('close')" class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-md text-xs transition">
            Cerrar
          </button>
        </div>

      </div>
    </div>
  </div>
</template>