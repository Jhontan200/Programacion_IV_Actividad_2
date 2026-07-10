<script setup>
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  project: { type: Object, default: null }
});

const emit = defineEmits(['close']);

// Formateador de fecha legible (Día, Mes, Año)
const formatDate = (dateStr) => {
  if (!dateStr) return 'No registrada';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Clases de color para el estado
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
  <div v-if="isOpen && project" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
    <!-- Fondo oscuro traslúcido -->
    <div class="fixed inset-0 bg-black opacity-50" @click="emit('close')"></div>

    <!-- Contenedor de Tarjeta -->
    <div class="relative w-full max-w-xl mx-auto my-6 z-50 p-4">
      <div class="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none">
        
        <!-- Cabecera -->
        <div class="flex items-start justify-between p-5 border-b border-solid border-slate-100 rounded-t bg-slate-50">
          <div class="flex items-center space-x-3">
            <span class="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 2H12m-3 9.375h.008v.008H9v-.008zm0 3h.008v.008H9v-.008zm3-3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm3-3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zM9.75 8.25h.008v.008H9.75V8.25zm.008 3h-.008V11.25h.008v.008zM7.5 15h.008v.008H7.5V15zm0 3h.008v.008H7.5V18zm-3-12h.008v.008H4.5V6zm0 3h.008v.008H4.5V9zm0 3h.008v.008H4.5V12zm0 3h.008v.008H4.5V15zm0 3h.008v.008H4.5V18zm15-12h.008v.008H19.5V6zm0 3h.008v.008H19.5V9zm0 3h.008v.008H19.5V12zm0 3h.008v.008H19.5V15zm0 3h.008v.008H19.5V18z" />
              </svg>
            </span>
            <h3 class="text-lg font-bold text-slate-800">
              Detalles del Proyecto
            </h3>
          </div>
          <button @click="emit('close')" class="p-1 ml-auto bg-transparent border-0 text-slate-400 hover:text-slate-600 text-2xl leading-none font-semibold outline-none focus:outline-none">
            ×
          </button>
        </div>

        <!-- Cuerpo del detalle -->
        <div class="p-6 space-y-6">
          
          <!-- Nombre del Proyecto -->
          <div>
            <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre</h4>
            <p class="text-lg font-bold text-slate-800">{{ project.name }}</p>
          </div>

          <!-- Descripción (Corregida con salto de línea automático para textos largos) -->
          <div>
            <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción</h4>
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 overflow-hidden">
              <p class="text-sm text-slate-600 whitespace-pre-wrap break-words">
                {{ project.description || 'Sin descripción detallada.' }}
              </p>
            </div>
          </div>

          <!-- Información Temporal y de Estado -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fecha de Inicio</h4>
              <p class="text-sm font-semibold text-slate-700">{{ formatDate(project.startDate) }}</p>
            </div>

            <div>
              <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estado de la Obra</h4>
              <span :class="['inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1', getStatusBadgeClass(project.statusName)]">
                {{ project.statusName }}
              </span>
            </div>
          </div>

        </div>

        <!-- Botón de Cerrar -->
        <div class="flex items-center justify-end p-4 border-t border-solid border-slate-100 rounded-b bg-slate-50">
          <button 
            type="button" 
            @click="emit('close')"
            class="px-4 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 font-semibold rounded-md text-xs shadow-sm transition"
          >
            Cerrar Vista
          </button>
        </div>

      </div>
    </div>
  </div>
</template>