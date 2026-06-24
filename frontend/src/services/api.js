import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/_/ai-solutions-api/api' : '/api');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const inquiryAPI = {
  submit: (data) => api.post('/inquiries', data),
  getAll: (params) => api.get('/inquiries', { params }),
  getOne: (id) => api.get(`/inquiries/${id}`),
  update: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
  getStatistics: () => api.get('/inquiries/statistics'),
  exportCSV: (params) => api.get('/inquiries/export/csv', { params, responseType: 'blob' }),
  exportPDF: (params) => api.get('/inquiries/export/pdf', { params, responseType: 'blob' }),
};

export const contentAPI = {
  getTestimonials: () => api.get('/content/testimonials'),
  submitTestimonialFeedback: (data) => api.post('/content/testimonials/feedback', data),
  getArticles: () => api.get('/content/articles'),
  getArticle: (slug) => api.get(`/content/articles/${slug}`),
  getEvents: () => api.get('/content/events'),
  getGallery: () => api.get('/content/gallery'),
  getPortfolio: () => api.get('/content/portfolio'),
  chatbot: (message) => api.post('/content/chatbot', { message }),
};

export const adminContentAPI = {
  testimonials: {
    getAll: () => api.get('/content/admin/testimonials'),
    create: (data) => api.post('/content/testimonials', data),
    update: (id, data) => api.put(`/content/testimonials/${id}`, data),
    delete: (id) => api.delete(`/content/testimonials/${id}`),
  },
  articles: {
    getAll: () => api.get('/content/admin/articles'),
    create: (data) => api.post('/content/articles', data),
    update: (id, data) => api.put(`/content/articles/${id}`, data),
    delete: (id) => api.delete(`/content/articles/${id}`),
  },
  events: {
    getAll: () => api.get('/content/admin/events'),
    create: (data) => api.post('/content/events', data),
    update: (id, data) => api.put(`/content/events/${id}`, data),
    delete: (id) => api.delete(`/content/events/${id}`),
  },
  gallery: {
    getAll: () => api.get('/content/admin/gallery'),
    create: (data) => api.post('/content/gallery', data),
    update: (id, data) => api.put(`/content/gallery/${id}`, data),
    delete: (id) => api.delete(`/content/gallery/${id}`),
  },
};

export default api;
