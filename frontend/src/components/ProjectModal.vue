<script setup>
import { ref, watch } from 'vue';
import Swal from 'sweetalert2'; // Importación añadida

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  project: { type: Object, default: null },
  statuses: { type: Array, required: true }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  description: '',
  startDate: '',
  statusId: ''
});

watch(() => props.project, (newVal) => {
  if (newVal) {
    // Convertir el string ISO a un objeto fecha y extraer componentes UTC limpios
    const date = new Date(newVal.startDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`; // Genera "YYYY-MM-DD" exacto

    form.value = {
      name: newVal.name || '',
      description: newVal.description || '',
      startDate: formattedDate,
      statusId: newVal.statusId || ''
    };
  } else {
    form.value = { name: '', description: '', startDate: '', statusId: '' };
  }
}, { immediate: true });

const handleSubmit = () => {
  // Validación de campos vacíos con SweetAlert2
  if (!form.value.name.trim() || !form.value.startDate || !form.value.statusId) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos requeridos (*).',
      confirmButtonColor: '#3b82f6'
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
      <div class="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
        
        <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
          <h3 class="text-xl font-semibold text-slate-800">
            {{ project ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto' }}
          </h3>
          <button @click="emit('close')" class="p-1 ml-auto bg-transparent border-0 text-slate-400 hover:text-slate-600 float-right text-2xl leading-none font-semibold outline-none focus:outline-none">
            ×
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="relative p-6 flex-auto space-y-4">
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Proyecto *</label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Ej. Condominio Las Palmas"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea 
                v-model="form.description" 
                rows="3"
                placeholder="Detalles sobre la construcción..."
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Fecha de Inicio *</label>
                <input 
                  v-model="form.startDate" 
                  type="date" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
                <select 
                  v-model="form.statusId" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="" disabled>Seleccione un estado</option>
                  <option v-for="status in statuses" :key="status.id" :value="status.id">
                    {{ status.name }}
                  </option>
                </select>
              </div>
            </div>

          </div>

          <div class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b space-x-3">
            <button 
              type="button" 
              @click="emit('close')"
              class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium rounded-md text-sm transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md text-sm shadow transition"
            >
              Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>