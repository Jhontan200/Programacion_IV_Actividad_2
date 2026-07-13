<script setup>
defineProps({
  projects: { type: Array, required: true }
});

const emit = defineEmits(['edit', 'view', 'delete']);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  
  // Extraemos año, mes y día directamente en UTC para evitar el desfase de zona horaria
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  // Reconstruimos la fecha en hora local exacta
  const localDate = new Date(year, month, day);
  return localDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getStatusBadgeClass = (statusName) => {
  switch (statusName) {
    case 'Planeado':
      return 'bg-blue-100 text-blue-800';
    case 'En Progreso':
      return 'bg-amber-100 text-amber-800';
    case 'Completado':
      return 'bg-green-100 text-green-800';
    case 'Suspendido':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow border border-slate-200">
    <table class="min-w-full divide-y divide-slate-200 text-left">
      <!-- Cabecera coloreada -->
      <thead class="bg-blue-900 text-white">
        <tr>
          <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-blue-100">Nombre del Proyecto</th>
          <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-blue-100">Descripción</th>
          <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-blue-100">Fecha de Inicio</th>
          <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-blue-100">Estado</th>
          <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-blue-100 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr v-if="projects.length === 0">
          <td colspan="5" class="px-6 py-8 text-center text-slate-500">
            No se encontraron proyectos con los criterios de búsqueda establecidos.
          </td>
        </tr>
        <tr v-for="project in projects" :key="project.id" class="hover:bg-slate-50 transition">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-semibold text-slate-900">{{ project.name }}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-slate-600 max-w-xs truncate" :title="project.description">
              {{ project.description || 'Sin descripción' }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-slate-600">{{ formatDate(project.startDate) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['px-2.5 py-1 text-xs font-medium rounded-full', getStatusBadgeClass(project.statusName)]">
              {{ project.statusName }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
            <div class="flex items-center justify-center space-x-2">
              
              <!-- Botón Editar con Tooltip -->
              <div class="relative group inline-block">
                <button 
                  @click="emit('edit', project)"
                  class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap z-20 transition opacity-0 group-hover:opacity-100">
                  Editar Proyecto
                </span>
              </div>

              <!-- NUEVO: Botón Ver Detalles con Tooltip -->
              <div class="relative group inline-block">
                <button 
                  @click="emit('view', project)"
                  class="p-2 text-teal-600 hover:text-teal-900 hover:bg-teal-50 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap z-20 transition opacity-0 group-hover:opacity-100">
                  Ver Detalles
                </span>
              </div>

              <!-- Botón Eliminar con Tooltip -->
              <div class="relative group inline-block">
                <button 
                  @click="emit('delete', project.id)"
                  class="p-2 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-800 text-white text-[11px] px-2 py-1 rounded shadow-md whitespace-nowrap z-20 transition opacity-0 group-hover:opacity-100">
                  Eliminar Proyecto
                </span>
              </div>

            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>