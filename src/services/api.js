// services/api.js
import axios from 'axios';

// NOTE: Replace this with your actual backend API base URL
const BASE_URL = 'https://your-backend-api.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// API methods
export const feelingAnalyzerAPI = {
  analyzeSymptoms: async (symptoms) => {
    // NOTE: Replace '/analyze-feelings' with your actual endpoint
    const response = await api.post('/analyze-feelings', {
      symptoms,
      timestamp: new Date().toISOString(),
      userId: JSON.parse(localStorage.getItem('user') || '{}').email
    });
    return response.data;
  }
};

export const surveyAPI = {
  submitSurvey: async (surveyData) => {
    // NOTE: Replace with your actual survey endpoint
    const response = await api.post('/surveys', surveyData);
    return response.data;
  },
  getSurveys: async () => {
    const response = await api.get('/surveys');
    return response.data;
  }
};

export const medicationAPI = {
  parseMedications: async (medicationText) => {
    // NOTE: Replace with your actual medication parsing endpoint
    const response = await api.post('/medications/parse', { text: medicationText });
    return response.data;
  }
};

export default api;
