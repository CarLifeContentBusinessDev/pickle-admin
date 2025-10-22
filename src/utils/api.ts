import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://pickle.obigo.ai',
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await api.post(
            'https://pickle.obigo.ai/admin/refresh',
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const newAccessToken = res.data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
