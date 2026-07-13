import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/projects', '/users') 
  : 'http://localhost:3000/api/users';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getUsers() { return apiClient.get('/'); },
  createUser(userData) { return apiClient.post('/', userData); },
  updateUser(id, userData) { return apiClient.put(`/${id}`, userData); }, // Agregado
  deleteUser(id) { return apiClient.delete(`/${id}`); },
  login(credentials) { return apiClient.post('/login', credentials); } // Agregado
};