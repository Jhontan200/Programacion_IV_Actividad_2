<script setup>
import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import projectService from '../services/projectService';
import ProjectTable from '../components/ProjectTable.vue';
import ProjectModal from '../components/ProjectModal.vue';
import ProjectDetailModal from '../components/ProjectDetailModal.vue';

// Definición de Props y Emits para comunicarse con App.vue
const props = defineProps({
  projects: { type: Array, required: true },
  statuses: { type: Array, required: true }
});
const emit = defineEmits(['refresh']);

// Estados reactivos internos del listado
const isModalOpen = ref(false);
const selectedProject = ref(null);
const isDetailModalOpen = ref(false);
const detailedProject = ref(null);
// Filtros y paginación
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Filtrado computado
const filteredProjects = computed(() => {
  return props.projects.filter(project => {
    const matchesQuery = 
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.value.toLowerCase()));

    const matchesStatus = 
      statusFilter.value === '' || 
      project.statusId === parseInt(statusFilter.value);

    return matchesQuery && matchesStatus;
  });
});

// Paginación computada
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage) || 1;
});

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

const openCreateModal = () => {
  selectedProject.value = null;
  isModalOpen.value = true;
};

const openEditModal = (project) => {
  selectedProject.value = project;
  isModalOpen.value = true;
};
// NUEVO: Abrir modal de detalles
const openDetailModal = (project) => {
  detailedProject.value = project;
  isDetailModalOpen.value = true;
};
// Guardar datos
const handleSave = async (formData) => {
  try {
    if (selectedProject.value) {
      await projectService.updateProject(selectedProject.value.id, formData);
      Swal.fire({
        icon: 'success',
        title: 'Proyecto actualizado',
        text: 'Los cambios fueron guardados exitosamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      await projectService.createProject(formData);
      Swal.fire({
        icon: 'success',
        title: 'Proyecto creado',
        text: 'El nuevo proyecto ha sido registrado.',
        timer: 1500,
        showConfirmButton: false
      });
    }
    isModalOpen.value = false;
    emit('refresh'); // Le avisa a App.vue que debe recargar los datos
  } catch (error) {
    console.error('Error al guardar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: 'Ocurrió un error inesperado al guardar la información.',
      confirmButtonColor: '#3b82f6'
    });
  }
};

// Eliminar
const handleDelete = async (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará de forma permanente el registro de la base de datos.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await projectService.deleteProject(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El proyecto ha sido borrado.',
          timer: 1500,
          showConfirmButton: false
        });
        emit('refresh'); // Le avisa a App.vue que recargue
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo retirar el proyecto.',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  });
};
</script>

<template>
  <div>
    <!-- Encabezado de sección -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Gestión de Proyectos</h1>
        <p class="text-sm text-slate-600 mt-1">Panel de control administrativo con operaciones CRUD sobre base de datos remota.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md text-sm transition flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Nuevo Proyecto</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre o descripción..."
          class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <span class="absolute left-3 top-2.5 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </span>
      </div>

      <div class="w-full md:w-64">
        <select 
          v-model="statusFilter"
          class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Todos los Estados</option>
          <option v-for="status in statuses" :key="status.id" :value="status.id">
            {{ status.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <ProjectTable 
      :projects="paginatedProjects"
      @edit="openEditModal"
      @view="openDetailModal" 
      @delete="handleDelete"
    />

    <!-- Controles Paginación -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div class="text-sm text-slate-600">
        Mostrando <span class="font-semibold text-slate-900">{{ paginatedProjects.length }}</span> de <span class="font-semibold text-slate-900">{{ filteredProjects.length }}</span> resultados
      </div>

      <div class="flex items-center space-x-2">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Anterior
        </button>

        <span class="text-sm text-slate-700 font-medium">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <button 
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal Formulario -->
    <ProjectModal 
      :isOpen="isModalOpen"
      :project="selectedProject"
      :statuses="statuses"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <!-- NUEVO: Modal de Lectura de Detalles -->
    <ProjectDetailModal 
      :isOpen="isDetailModalOpen"
      :project="detailedProject"
      @close="isDetailModalOpen = false"
    />
  </div>
</template>