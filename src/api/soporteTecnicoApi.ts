import axios from 'axios';

export const getBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3000/api';
  }

  if (hostname.startsWith('10.') || hostname.startsWith('192.168.')) {
    return import.meta.env.VITE_API_URL_INTERNAL;
  }

  return import.meta.env.VITE_API_URL_EXTERNAL;
};

export const API_BASE_URL = getBaseUrl();

const soporteTecnicoApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

soporteTecnicoApi.interceptors.request.use((config) => {
  const currentLang = localStorage.getItem('i18nextLng') || 'es';
  const baseLang = currentLang.split('-')[0];

  config.headers['Accept-Language'] = baseLang;

  return config;
});

export { soporteTecnicoApi };