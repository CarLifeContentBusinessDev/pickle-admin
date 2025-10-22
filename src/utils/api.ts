import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pickle.obigo.ai',
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
  console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
