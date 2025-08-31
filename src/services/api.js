import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    const { response, message } = error;

    console.error('❌ Erro na resposta:', error);

    if (response) {
      const { status, data } = response;
      const mensagem = data?.mensagem || 'Ocorreu um erro!';

      switch (status) {
        case 400:
          toast.error(mensagem);
          break;
        case 401:
          toast.error('Sessão expirada. Faça login novamente');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');

          window.location.href = '/login';
          break;
        case 403:
        case 404:
        case 422:
        case 500:
          toast.error(mensagem);
          break;
        default:
          toast.error(mensagem);
      }
    } else if (message === 'Network Error') {
      toast.error('Erro de conexão. Verifique sua internet');
    } else if (message.includes('timeout')) {
      toast.error('Tempo limite esgotado. Tente novamente');
    } else {
      toast.error('Erro inesperado');
    }

    return Promise.reject(error);
  }
);

export default api;
