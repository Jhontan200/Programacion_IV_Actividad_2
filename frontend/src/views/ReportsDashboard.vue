<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Chart from 'chart.js/auto'; // Importación autoejecutable oficial de Chart.js

const props = defineProps({
  projects: { type: Array, required: true }
});

// Referencias a los elementos Canvas del DOM
const barChartCanvas = ref(null);
const doughnutChartCanvas = ref(null);

// Instancias de Chart.js
let barChartInstance = null;
let doughnutChartInstance = null;

// Métricas calculadas
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

// Renderizado de Gráficos usando la librería Chart.js
const renderCharts = () => {
  // 1. Limpieza de instancias previas para evitar duplicidad de canvas
  if (barChartInstance) barChartInstance.destroy();
  if (doughnutChartInstance) doughnutChartInstance.destroy();

  if (!barChartCanvas.value || !doughnutChartCanvas.value) return;

  // 2. Configuración Gráfico de Barras (Distribución por Estado)
  barChartInstance = new Chart(barChartCanvas.value, {
    type: 'bar',
    data: {
      labels: ['Planeado', 'En Progreso', 'Completado', 'Suspendido'],
      datasets: [{
        label: 'Proyectos',
        data: [plannedCount.value, inProgressCount.value, completedCount.value, suspendedCount.value],
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)', // Azul
          'rgba(245, 158, 11, 0.85)', // Ámbar
          'rgba(34, 197, 94, 0.85)',  // Verde
          'rgba(239, 68, 68, 0.85)'   // Rojo
        ],
        borderColor: ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444'],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: '#64748b' },
          grid: { color: '#e2e8f0' }
        },
        x: {
          ticks: { color: '#64748b' },
          grid: { display: false }
        }
      }
    }
  });

  // 3. Configuración Gráfico de Donut (Tasa de Finalización)
  const remainingPercentage = 100 - completionPercentage.value;

  doughnutChartInstance = new Chart(doughnutChartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Completados (%)', 'Restantes (%)'],
      datasets: [{
        data: [completionPercentage.value, remainingPercentage],
        backgroundColor: [
          'rgba(34, 197, 94, 0.85)', // Verde
          'rgba(203, 213, 225, 0.5)'  // Gris pizarra claro
        ],
        borderColor: ['#22c55e', '#cbd5e1'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, color: '#64748b', font: { size: 11 } }
        }
      },
      cutout: '70%' // Hace que el centro de la dona sea más delgado
    }
  });
};

// Ciclos de vida y observadores para refrescar gráficos reactivamente
onMounted(() => {
  renderCharts();
});

watch(() => props.projects, () => {
  renderCharts();
}, { deep: true });
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Panel de Reportes y Estadísticas</h1>
      <p class="text-sm text-slate-600 mt-1">Métricas de rendimiento generadas dinámicamente con Chart.js.</p>
    </div>

    <!-- Tarjetas de Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Total -->
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

      <!-- En Progreso -->
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

      <!-- Planeados / Suspendidos -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-blue-50 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-500 uppercase">Planeados / Suspend.</p>
          <p class="text-2xl font-bold text-slate-900">{{ plannedCount }} / {{ suspendedCount }}</p>
        </div>
      </div>

    </div>

    <!-- Gráficas Dinámicas de Chart.js -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Gráfica de Barras -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 lg:col-span-2">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Distribución por Estado</h3>
        <!-- Contenedor relativo con altura fija requerido por Chart.js -->
        <div class="relative h-64">
          <canvas ref="barChartCanvas"></canvas>
        </div>
      </div>

      <!-- Gráfica de Donut (Tasa de Finalización) -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200 flex flex-col justify-between">
        <h3 class="text-lg font-bold text-slate-800 mb-4 text-center font-sans">Tasa de Finalización</h3>
        
        <div class="relative flex items-center justify-center h-48">
          <canvas ref="doughnutChartCanvas"></canvas>
          <!-- Indicador textual absoluto superpuesto en el centro del donut -->
          <div class="absolute flex flex-col items-center justify-center pointer-events-none pb-2">
            <span class="text-3xl font-extrabold text-slate-800">{{ completionPercentage }}%</span>
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Entregas</span>
          </div>
        </div>

        <div class="text-center text-xs text-slate-500 mt-4 border-t border-slate-100 pt-3">
          Estadísticas calculadas en base a las obras marcadas en estado 'Completado'.
        </div>
      </div>

    </div>
  </div>
</template>