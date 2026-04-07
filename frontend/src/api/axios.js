import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  health: () => api.get('/auth/health'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
};

// Skill Catalog API
export const skillAPI = {
  getAllSkills: () => api.get('/skills/catalog'),
  getSkillById: (id) => api.get(`/skills/catalog/${id}`),
  getMySkills: () => api.get('/skills/my'),
  addSkill: (data) => api.post('/skills/my', data),
  updateSkill: (id, data) => api.put(`/skills/my/${id}`, data),
  removeSkill: (id) => api.delete(`/skills/my/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Project API
export const projectAPI = {
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  allocateEmployee: (projectId, data) => api.post(`/projects/${projectId}/allocate`, data),
  deallocateEmployee: (projectId, employeeId) => api.delete(`/projects/${projectId}/allocate/${employeeId}`),
  getTeam: (projectId) => api.get(`/projects/${projectId}/team`),
};

// Search API
export const searchAPI = {
  searchEmployees: (params) => api.get('/search/employees', { params }),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  updateUserAvailability: (id, status) => api.put(`/admin/users/${id}/availability?status=${status}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Application API
export const applicationAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getAvailableProjects: () => api.get('/applications/available-projects'),
  getAllApplications: () => api.get('/applications'),
  reviewApplication: (id, data) => api.put(`/applications/${id}/review`, data),
};

