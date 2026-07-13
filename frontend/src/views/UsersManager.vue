<script setup>
import { ref, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import userService from '../services/userService';
import UserTable from '../components/UserTable.vue';
import UserModal from '../components/UserModal.vue';
import UserDetailModal from '../components/UserDetailModal.vue';

const props = defineProps({
  users: { type: Array, required: true }
});
const emit = defineEmits(['refresh']);

// Estados de modales
const isModalOpen = ref(false);
const isDetailOpen = ref(false);
const selectedUser = ref(null);

// Filtros y paginación
const searchQuery = ref('');
const roleFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Filtros computados
const filteredUsers = computed(() => {
  return props.users.filter(user => {
    const matchesQuery = 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesRole = roleFilter.value === '' || user.role === roleFilter.value;
    return matchesQuery && matchesRole;
  });
});

// Paginación
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage) || 1;
});

watch([searchQuery, roleFilter], () => {
  currentPage.value = 1;
});

const openCreateModal = () => {
  selectedUser.value = null;
  isModalOpen.value = true;
};

const openEditModal = (user) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const openDetailModal = (user) => {
  selectedUser.value = user;
  isDetailOpen.value = true;
};

const handleSave = async (userData) => {
  try {
    if (selectedUser.value) {
      await userService.updateUser(selectedUser.value.id, userData);
      Swal.fire({ icon: 'success', title: 'Usuario actualizado', text: 'Cambios guardados con éxito.', timer: 1500, showConfirmButton: false });
    } else {
      await userService.createUser(userData);
      Swal.fire({ icon: 'success', title: 'Usuario registrado', text: 'El nuevo usuario se agregó con éxito.', timer: 1500, showConfirmButton: false });
    }
    isModalOpen.value = false;
    emit('refresh');
  } catch (error) {
    console.error('Error al guardar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.error || 'No se pudo guardar la información.'
    });
  }
};

const handleDelete = async (id) => {
  Swal.fire({
    title: '¿Eliminar usuario?',
    text: "Esta acción retirará al usuario permanentemente del sistema de ingreso.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await userService.deleteUser(id);
        Swal.fire({ icon: 'success', title: 'Usuario retirado', text: 'Registro borrado.', timer: 1500, showConfirmButton: false });
        emit('refresh');
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo completar la operación.' });
      }
    }
  });
};
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Sistema de Gestión de Ingreso</h1>
        <p class="text-sm text-slate-600 mt-1">Control administrativo y registro de credenciales de usuarios de obra.</p>
      </div>
      <button @click="openCreateModal" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-sm transition flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235V19.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75v-.015c0-2.84-2.3-5.14-5.14-5.14H9.14a5.14 5.14 0 00-5.14 5.14z" />
        </svg>
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Barra de Filtros -->
    <div class="bg-white p-4 rounded-lg shadow border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o correo..." class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <span class="absolute left-3 top-2.5 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </span>
      </div>

      <div class="w-full md:w-64">
        <select v-model="roleFilter" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos los Roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Ingeniero Residente">Ingeniero Residente</option>
          <option value="Supervisor de Obra">Supervisor de Obra</option>
        </select>
      </div>
    </div>

    <UserTable :users="paginatedUsers" @edit="openEditModal" @view="openDetailModal" @delete="handleDelete" />

    <!-- Controles de Paginación -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div class="text-sm text-slate-600">
        Mostrando <span class="font-semibold text-slate-900">{{ paginatedUsers.length }}</span> de <span class="font-semibold text-slate-900">{{ filteredUsers.length }}</span> resultados
      </div>

      <div class="flex items-center space-x-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition">Anterior</button>
        <span class="text-sm text-slate-700 font-medium">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition">Siguiente</button>
      </div>
    </div>

    <!-- Modales -->
    <UserModal :isOpen="isModalOpen" :user="selectedUser" @close="isModalOpen = false" @save="handleSave" />
    <UserDetailModal :isOpen="isDetailOpen" :user="selectedUser" @close="isDetailOpen = false" />
  </div>
</template>