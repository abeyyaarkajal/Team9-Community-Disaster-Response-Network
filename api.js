import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: (id) => api.get(`/auth/profile/${id}`),
};

export const incidentAPI = {
    create: (data) => api.post('/incidents', data),
    getAll: (params) => api.get('/incidents', { params }),
    getOne: (id) => api.get(`/incidents/${id}`),
    assign: (id, volunteerId) => api.put(`/incidents/${id}/assign`, { volunteerId }),
    updateStatus: (id, status) => api.put(`/incidents/${id}/status`, { status }),
    delete: (id) => api.delete(`/incidents/${id}`),
};

export const alertAPI = {
    create: (data) => api.post('/alerts', data),
    getAll: () => api.get('/alerts'),
    getOne: (id) => api.get(`/alerts/${id}`),
    deactivate: (id) => api.put(`/alerts/${id}/deactivate`),
};

export const hazardZoneAPI = {
    create: (data) => api.post('/hazard-zones', data),
    getAll: (params) => api.get('/hazard-zones', { params }),
    getOne: (id) => api.get(`/hazard-zones/${id}`),
    update: (id, data) => api.put(`/hazard-zones/${id}`, data),
};

export const damageReportAPI = {
    create: (data) => api.post('/damage-reports', data),
    getAll: (params) => api.get('/damage-reports', { params }),
    getOne: (id) => api.get(`/damage-reports/${id}`),
    updateStatus: (id, data) => api.put(`/damage-reports/${id}/status`, data),
};

export default api;