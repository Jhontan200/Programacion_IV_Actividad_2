<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import projectService from './services/projectService';
import userService from './services/userService';
import ReportsDashboard from './views/ReportsDashboard.vue';
import ProjectsManager from './views/ProjectsManager.vue';
import UsersManager from './views/UsersManager.vue';
import Login from './views/Login.vue'; // Importación agregada

// Control de Sesión Activa
const currentUser = ref(null);

// Control de navegación y colapso del Sidebar
const currentView = ref('reports');
const isCollapsed = ref(false);

// Estados reactivos compartidos
const projects = ref([]);
const statuses = ref([]);
const users = ref([]);
const isLoading = ref(false);

const loadAllData = async () => {
  if (!currentUser.value) return; // No carga datos si no hay sesión
  isLoading.value = true;
  try {
    const [projectsRes, statusesRes, usersRes] = await Promise.all([
      projectService.getProjects(),
      projectService.getStatuses(),
      userService.getUsers()
    ]);
    projects.value = projectsRes.data;
    statuses.value = statusesRes.data;
    users.value = usersRes.data;
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

// Guardar sesión en el cliente
const handleLoginSuccess = (user) => {
  currentUser.value = user;
  localStorage.setItem('user', JSON.stringify(user));
  loadAllData();
};

// Cerrar sesión
const handleLogout = () => {
  Swal.fire({
    title: '¿Cerrar Sesión?',
    text: "Saldrás del sistema de gestión de ingreso.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      currentUser.value = null;
      localStorage.removeItem('user');
      projects.value = [];
      users.value = [];
    }
  });
};

onMounted(() => {
  // Verificar si hay sesión activa guardada
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
    loadAllData();
  }
});
</script>

<template>
  <!-- 1. SI NO HAY SESIÓN ACTIVA, MOSTRAR LOGIN -->
  <Login v-if="!currentUser" @login-success="handleLoginSuccess" />

  <!-- 2. SI HAY SESIÓN ACTIVA, MOSTRAR LA APLICACIÓN -->
  <div v-else class="flex h-screen bg-slate-100 overflow-hidden">
    
    <!-- SIDEBAR COLAPSABLE -->
    <aside 
      :class="[
        'bg-slate-900 text-slate-300 flex flex-col shadow-lg z-30 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      
      <!-- Cabecera -->
      <div class="h-16 flex items-center justify-between border-b border-slate-800 px-4">
        <span v-show="!isCollapsed" class="text-sm font-bold text-white tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-blue-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3z" />
          </svg>
          G-PROYECTOS
        </span>

        <button 
          @click="isCollapsed = !isCollapsed"
          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition mx-auto"
          :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path v-if="isCollapsed" stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <!-- Menú de Opciones -->
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

        <!-- Opción 3: Gestión de Ingreso -->
        <button 
          @click="currentView = 'users'"
          :class="[
            'w-full flex items-center rounded-lg text-sm font-semibold transition duration-150',
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3',
            currentView === 'users' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
          ]"
          :title="isCollapsed ? 'Gestión de Usuarios' : ''"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20c-2.213 0-4.302-.63-6.089-1.73v-.013a4.125 4.125 0 017.533-2.493M15 9.128a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm4.5 1.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <span v-show="!isCollapsed" class="transition-all">Gestión de Ingreso</span>
        </button>

      </nav>

      <!-- Botón de Cerrar Sesión -->
      <div class="p-4 border-t border-slate-800">
        <button 
          @click="handleLogout"
          :class="[
            'w-full flex items-center rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950 hover:text-rose-200 transition duration-150',
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          ]"
          title="Cerrar Sesión"
        >
          <!-- Icono Salir -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span v-show="!isCollapsed">Cerrar Sesión</span>
        </button>
      </div>

    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="flex-1 flex flex-col overflow-y-auto">
      <div class="p-8 max-w-7xl w-full mx-auto">
        
        <div v-if="isLoading && projects.length === 0" class="flex justify-center items-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div v-else>
          <ReportsDashboard 
            v-if="currentView === 'reports'" 
            :projects="projects" 
            :users="users"
          />

          <ProjectsManager 
            v-else-if="currentView === 'projects'" 
            :projects="projects" 
            :statuses="statuses" 
            @refresh="loadAllData" 
          />

          <UsersManager 
            v-else-if="currentView === 'users'" 
            :users="users" 
            @refresh="loadAllData" 
          />
        </div>

      </div>
    </main>

  </div>
</template>