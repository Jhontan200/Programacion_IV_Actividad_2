import axios from 'axios';

// En desarrollo apuntamos al puerto 3000 de Express.
// En producción, al usar la misma URL relativa, el navegador sabrá dónde buscar de manera automática.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/projects';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Obtener la lista de proyectos
  getProjects() {
    return apiClient.get('/');
  },

  // Crear un nuevo proyecto
  createProject(projectData) {
    return apiClient.post('/', projectData);
  },

  // Actualizar un proyecto existente
  updateProject(id, projectData) {
    return apiClient.put(`/${id}`, projectData);
  },

  // Eliminar un proyecto
  deleteProject(id) {
    return apiClient.delete(`/${id}`);
  },

  // Obtener el catálogo de estados (para el formulario)
  getStatuses() {
    return apiClient.get('/statuses');
  }
};