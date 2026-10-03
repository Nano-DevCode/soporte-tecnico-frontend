import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth.store';

const INACTIVITY_TIMEOUT_MS = 7 * 60 * 60 * 1000; // 7 horas de inactividad continua
const STORAGE_KEY = 'soporte_last_activity';

export const SessionTimer = () => {
  const { authStatus, logout, checkAuthStatus } = useAuthStore();
  // 1. Inicializado en 0 (puro para el render de React)
  const lastActivityRef = useRef<number>(0);

  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    // 2. Aquí dentro (efecto secundario) sí es correcto usar Date.now()
    const now = Date.now();
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsedSaved = saved ? Number(saved) : now;
    const initialTime = Number.isNaN(parsedSaved) || parsedSaved <= 0 ? now : parsedSaved;
    
    lastActivityRef.current = initialTime;
    localStorage.setItem(STORAGE_KEY, String(initialTime));

    let lastThrottle = now;

    const recordUserActivity = () => {
      const currentTime = Date.now();
      // Throttle a cada 5 segundos para optimizar rendimiento y acceso a storage
      if (currentTime - lastThrottle > 5000) {
        lastThrottle = currentTime;
        lastActivityRef.current = currentTime;
        try {
          localStorage.setItem(STORAGE_KEY, String(currentTime));
        } catch {
          // Ignorar si el storage falla o está lleno
        }
      }
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordUserActivity, { passive: true });
    });

    const verifyIdleTimeout = () => {
      const savedTime = localStorage.getItem(STORAGE_KEY);
      const parsedTime = savedTime ? Number(savedTime) : lastActivityRef.current;
      const lastAct = Number.isNaN(parsedTime) || parsedTime <= 0 ? Date.now() : parsedTime;
      const idleTime = Date.now() - lastAct;

      if (idleTime >= INACTIVITY_TIMEOUT_MS) {
        localStorage.removeItem(STORAGE_KEY);
        logout();
      }
    };

    const interval = setInterval(verifyIdleTimeout, 60000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authStatus === 'authenticated') {
        const savedTime = localStorage.getItem(STORAGE_KEY);
        const parsedTime = savedTime ? Number(savedTime) : lastActivityRef.current;
        const lastAct = Number.isNaN(parsedTime) || parsedTime <= 0 ? Date.now() : parsedTime;
        const idleTime = Date.now() - lastAct;

        if (idleTime >= INACTIVITY_TIMEOUT_MS) {
          localStorage.removeItem(STORAGE_KEY);
          logout();
        } else {
          // Sigue activo: registrar actividad y validar con backend
          recordUserActivity();
          checkAuthStatus();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordUserActivity);
      });
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authStatus, logout, checkAuthStatus]);

  return null;
};