import axios from 'axios';

const soporteTecnicoApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, 
});

soporteTecnicoApi.interceptors.request.use((config) => {
  const currentLang = localStorage.getItem('i18nextLng') || 'es';

  const baseLang = currentLang.split('-')[0];

  config.headers['Accept-Language'] = baseLang;

  return config;
});

export { soporteTecnicoApi };