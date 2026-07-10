<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import projectService from './services/projectService';
import ReportsDashboard from './views/ReportsDashboard.vue';
import ProjectsManager from './views/ProjectsManager.vue';

// Control de navegación y colapso del Sidebar
const currentView = ref('reports');
const isCollapsed = ref(false); // Estado para abrir/cerrar sidebar

// Estados reactivos compartidos
const projects = ref([]);
const statuses = ref([]);
const isLoading = ref(false);

const loadAllData = async () => {
  isLoading.value = true;
  try {
    const [projectsRes, statusesRes] = await Promise.all([
      projectService.getProjects(),
      projectService.getStatuses()
    ]);
    projects.value = projectsRes.data;
    statuses.value = statusesRes.data;
  } catch (error) {
    console.error('Error de red al conectar con Neon:', error);
    Swal.fire({
      icon: 'error',
      title: 'Fallo de conexión',
      text: 'No se pudo comunicar con el servidor de base de datos Neon.',
      confirmButtonColor: '#3b82f6'
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden">
    
    <!-- SIDEBAR COLAPSABLE CON TRANSICIÓN -->
    <aside 
      :class="[
        'bg-slate-900 text-slate-300 flex flex-col shadow-lg z-30 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      
      <!-- Cabecera del Sidebar con Logo y Botón de Toggle -->
      <div class="h-16 flex items-center justify-between border-b border-slate-800 px-4">
        <!-- Logo (se oculta si está colapsado) -->
        <span 
          v-show="!isCollapsed" 
          class="text-sm font-bold text-white tracking-wider flex items-center gap-2 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-blue-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3z" />
          </svg>
          G-PROYECTOS
        </span>

        <!-- Botón para Abrir / Cerrar Sidebar -->
        <button 
          @click="isCollapsed = !isCollapsed"
          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition mx-auto"
          :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
        >
          <!-- Icono de Hamburguesa / Flechas de colapso -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path v-if="isCollapsed" stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <!-- Menú de Opciones de Navegación -->
      <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        
        <!-- Opción 1: Reportes (Dashboard) -->
        <button 
          @click="currentView = 'reports'"
          :class="[
            'w-full flex items-center rounded-lg text-sm font-semibold transition duration-150',
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
            currentView === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          ]"
          :title="isCollapsed ? 'Reportes y Gráficas' : ''"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0017.75 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
          <span v-show="!isCollapsed" class="transition-all">Reportes y Gráficas</span>
        </button>

        <!-- Opción 2: Gestión de Proyectos -->
        <button 
          @click="currentView = 'projects'"
          :class="[
            'w-full flex items-center rounded-lg text-sm font-semibold transition duration-150',
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
            currentView === 'projects' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          ]"
          :title="isCollapsed ? 'Gestión de Proyectos' : ''"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5m-16.5-7.5h16.5M3.75 12h16.5m-16.5 3.75h16.5m-16.5-7.5h16.5" />
          </svg>
          <span v-show="!isCollapsed" class="transition-all">Gestión de Proyectos</span>
        </button>

      </nav>

      <!-- Footer del Sidebar -->
      <div class="p-4 border-t border-slate-800 text-center text-xs text-slate-500 truncate">
        {{ isCollapsed ? 'v1' : 'v1.0.0 — Neon DB' }}
      </div>
    </aside>

    <!-- ÁREA DE CONTENIDO PRINCIPAL -->
    <main class="flex-1 flex flex-col overflow-y-auto">
      
      <div class="p-8 max-w-7xl w-full mx-auto">
        
        <div v-if="isLoading && projects.length === 0" class="flex justify-center items-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else>
          <ReportsDashboard 
            v-if="currentView === 'reports'" 
            :projects="projects" 
          />

          <ProjectsManager 
            v-else-if="currentView === 'projects'" 
            :projects="projects" 
            :statuses="statuses" 
            @refresh="loadAllData" 
          />
        </div>

      </div>
    </main>

  </div>
</template>