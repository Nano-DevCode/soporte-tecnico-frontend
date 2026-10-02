import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { refreshTokenAction } from '@/auth/actions/refresh-token.action';

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

// Control de concurrencia para la rotación de tokens
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

// Interceptor de respuesta: auto-rotación de refresh token ante error 401
soporteTecnicoApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout');

    if (isAuthRoute || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => soporteTecnicoApi(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await refreshTokenAction();
      processQueue(null);
      return soporteTecnicoApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);

      // Si falla la renovación, limpiar sesión de forma asíncrona
      import('@/auth/store/auth.store')
        .then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        })
        .catch(() => {});

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { soporteTecnicoApi };