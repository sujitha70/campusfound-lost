import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if present
axiosInstance.interceptors.request.use(
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

// Response interceptor: Handle expired tokens or unauthenticated errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 and on protected action, optionally clear token
      // We don't automatically redirect if checking public endpoints
      if (localStorage.getItem('token') && error.config.headers?.Authorization) {
        // Token was invalid or expired
        console.warn('Session expired or unauthorized token.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

