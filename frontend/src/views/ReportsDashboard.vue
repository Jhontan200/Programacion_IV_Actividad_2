<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  projects: { type: Array, required: true },
  users: { type: Array, default: () => [] } // Propiedad de usuarios añadida
});

// Canvas Refs
const barChartCanvas = ref(null);
const doughnutChartCanvas = ref(null);
const userChartCanvas = ref(null); // Canvas agregado

// Instancias Chart.js
let barChartInstance = null;
let doughnutChartInstance = null;
let userChartInstance = null;

// Métricas de Proyectos
const totalProjects = computed(() => props.projects.length);
const countByStatus = (statusId) => props.projects.filter(p => p.statusId === statusId).length;

const plannedCount = computed(() => countByStatus(1));
const inProgressCount = computed(() => countByStatus(2));
const completedCount = computed(() => countByStatus(3));
const suspendedCount = computed(() => countByStatus(4));

const completionPercentage = computed(() => {
  if (totalProjects.value === 0) return 0;
  return Math.round((completedCount.value / totalProjects.value) * 100);
});

// Métricas de Usuarios
const totalUsers = computed(() => props.users.length);
const countByRole = (roleName) => props.users.filter(u => u.role === roleName).length;

const adminCount = computed(() => countByRole('Administrador'));
const engineerCount = computed(() => countByRole('Ingeniero Residente'));
const supervisorCount = computed(() => countByRole('Supervisor de Obra'));

// Renderizado con Chart.js
const renderCharts = () => {
  if (barChartInstance) barChartInstance.destroy();
  if (doughnutChartInstance) doughnutChartInstance.destroy();
  if (userChartInstance) userChartInstance.destroy();

  if (!barChartCanvas.value || !doughnutChartCanvas.value || !userChartCanvas.value) return;

  // 1. Gráfico de Barras (Proyectos por Estado)
  barChartInstance = new Chart(barChartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Planeado', 'En Progreso', 'Completado', 'Suspendido'],
      datasets: [{
        label: 'Proyectos',
        data: [plannedCount.value, inProgressCount.value, completedCount.value, suspendedCount.value],
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(34, 197, 94, 0.85)',
          'rgba(239, 68, 68, 0.85)'
        ],
        borderColor: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444'],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, color: '#64748b' } },
        x: { ticks: { color: '#64748b' }, grid: { display: false } }
      }
    }
  });

  // 2. Gráfico de Donut (Tasa de Finalización de Proyectos)
  const remainingPercentage = 100 - completionPercentage.value;
  doughnutChartInstance = new Chart(doughnutChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Completados (%)', 'Restantes (%)'],
      datasets: [{
        data: [completionPercentage.value, remainingPercentage],
        backgroundColor: ['rgba(34, 197, 94, 0.85)', 'rgba(203, 213, 225, 0.5)'],
        borderColor: ['#22c55e', '#cbd5e1'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, color: '#64748b' } } },
      cutout: '70%'
    }
  });

  // 3. NUEVO: Gráfico de Donut (Usuarios por Rol)
  userChartInstance = new Chart(userChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Administradores', 'Ingenieros', 'Supervisores'],
      datasets: [{
        data: [adminCount.value, engineerCount.value, supervisorCount.value],
        backgroundColor: [
          'rgba(99, 102, 241, 0.85)',  // Indigo
          'rgba(6, 182, 212, 0.85)',   // Cyan
          'rgba(168, 85, 247, 0.85)'   // Purple
        ],
        borderColor: ['#6366f1', '#06b6d4', '#a855f7'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, color: '#64748b' } } },
      cutout: '70%'
    }
  });
};

onMounted(() => { renderCharts(); });
watch(() => [props.projects, props.users], () => { renderCharts(); }, { deep: true });
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Panel de Reportes y Estadísticas</h1>
      <p class="text-sm text-slate-600 mt-1">Métricas unificadas de usuarios e infraestructura con Chart.js.</p>
    </div>

    <!-- Tarjetas de Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Total Proyectos -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-slate-100 text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase">Total Proyectos</p>
          <p class="text-2xl font-bold text-slate-900">{{ totalProjects }}</p>
        </div>
      </div>

      <!-- En Ejecución -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-amber-50 text-amber-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase">En Ejecución</p>
          <p class="text-2xl font-bold text-slate-900">{{ inProgressCount }}</p>
        </div>
      </div>

      <!-- Completados -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-green-50 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase">Completados</p>
          <p class="text-2xl font-bold text-slate-900">{{ completedCount }}</p>
        </div>
      </div>

      <!-- NUEVA TARJETA: Total Usuarios -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-indigo-50 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20c-2.213 0-4.302-.63-6.089-1.73v-.013a4.125 4.125 0 017.533-2.493M15 9.128a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm4.5 1.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase">Usuarios Registrados</p>
          <p class="text-2xl font-bold text-slate-900">{{ totalUsers }}</p>
        </div>
      </div>

    </div>

    <!-- Gráficas Dinámicas de Chart.js -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Gráfica de Barras -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 lg:col-span-1">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Distribución de Proyectos</h3>
        <div class="relative h-64">
          <canvas ref="barChartCanvas"></canvas>
        </div>
      </div>

      <!-- Gráfica de Donut (Tasa de Finalización de Proyectos) -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 class="text-lg font-bold text-slate-800 mb-4 text-center">Tasa de Finalización</h3>
        <div class="relative flex items-center justify-center h-48">
          <canvas ref="doughnutChartCanvas"></canvas>
          <div class="absolute flex flex-col items-center justify-center pointer-events-none pb-2">
            <span class="text-3xl font-extrabold text-slate-800">{{ completionPercentage }}%</span>
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avance</span>
          </div>
        </div>
      </div>

      <!-- NUEVA GRÁFICA: Donut (Usuarios por Rol) -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 class="text-lg font-bold text-slate-800 mb-4 text-center">Usuarios por Rol</h3>
        <div class="relative flex items-center justify-center h-48">
          <canvas ref="userChartCanvas"></canvas>
          <div class="absolute flex flex-col items-center justify-center pointer-events-none pb-2">
            <span class="text-3xl font-extrabold text-slate-800">{{ totalUsers }}</span>
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cuentas</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>