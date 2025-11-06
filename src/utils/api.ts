import axios from 'axios';
import { toast } from 'react-toastify';

const FILEID = import.meta.env.VITE_FILE_ID;

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

api.interceptors.response.use((response) => {
  const { resultCode } = response.data;
  if (resultCode === 'E0123') {
    localStorage.removeItem('accessToken');

    toast.error('로그인 토큰이 만료되었습니다. 다시 로그인해주세요.');
  }

  return response;
});

const excelApi = axios.create({
  baseURL: `https://graph.microsoft.com/v1.0/me/drive/items/${FILEID}/workbook`,
});

excelApi.interceptors.request.use(
  (config) => {
    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      config.headers.Authorization = `Bearer ${loginToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api, excelApi };
