import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth.store';

const INACTIVITY_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 horas de inactividad continua
const STORAGE_KEY = 'soporte_last_activity';

export const SessionTimer = () => {
  const { authStatus, logout, checkAuthStatus } = useAuthStore();
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    // Inicializar timestamp con el valor guardado en localStorage o el momento actual
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsedSaved = saved ? Number(saved) : Date.now();
    const initialTime = Number.isNaN(parsedSaved) ? Date.now() : parsedSaved;
    lastActivityRef.current = initialTime;
    localStorage.setItem(STORAGE_KEY, String(initialTime));

    let lastThrottle = Date.now();

    const recordUserActivity = () => {
      const now = Date.now();
      // Throttle a cada 5 segundos para optimizar rendimiento y acceso a storage
      if (now - lastThrottle > 5000) {
        lastThrottle = now;
        lastActivityRef.current = now;
        try {
          localStorage.setItem(STORAGE_KEY, String(now));
        } catch {
          // Ignorar si storage falla
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
      const lastAct = Number.isNaN(parsedTime) ? Date.now() : parsedTime;
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
        const lastAct = Number.isNaN(parsedTime) ? Date.now() : parsedTime;
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