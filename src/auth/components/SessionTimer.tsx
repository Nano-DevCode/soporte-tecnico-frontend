import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

// 2 horas en milisegundos
const HOURS_MS = 2 * 60 * 60 * 1000;

export const SessionTimer = () => {
  const { authStatus, lastCheck, logout, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    if (authStatus !== 'authenticated' || !lastCheck) return;

    const interval = setInterval(() => {
      const timeElapsed = Date.now() - lastCheck;
      
      if (timeElapsed >= HOURS_MS) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [authStatus, lastCheck, logout]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authStatus === 'authenticated' && lastCheck) {
        
        const timeElapsed = Date.now() - lastCheck;

        if (timeElapsed >= HOURS_MS) {
          logout();
        } else {
          checkAuthStatus();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authStatus, lastCheck, logout, checkAuthStatus]);

  return null;
};