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

      switch (status) {
        case 400:
          toast.error(data?.message || 'Dados inválidos');
          break;
        case 401:
          toast.error('Sessão expirada. Faça login novamente');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');

          window.location.href = '/login';
          break;
        case 403:
          toast.error('Acesso negado');
          break;
        case 404:
          toast.error('Recurso não encontrado');
          break;
        case 422:
          if (data?.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err.message || err));
          } else {
            toast.error(data?.message || 'Erro de validação');
          }
          break;
        case 500:
          toast.error('Erro interno do servidor');
          break;
        default:
          toast.error(data?.message || 'Erro inesperado');
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
