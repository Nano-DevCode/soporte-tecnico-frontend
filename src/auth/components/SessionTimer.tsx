import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

const HOURS_MS = 2 * 60 * 60 * 1000; // 2 horas

export const SessionTimer = () => {
  // Ahora usamos sessionStart para el límite de tiempo
  const { authStatus, sessionStart, logout, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    if (authStatus !== 'authenticated' || !sessionStart) return;

    const interval = setInterval(() => {
      const timeElapsed = Date.now() - sessionStart;
      
      if (timeElapsed >= HOURS_MS) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [authStatus, sessionStart, logout]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authStatus === 'authenticated' && sessionStart) {
        
        const timeElapsed = Date.now() - sessionStart;

        if (timeElapsed >= HOURS_MS) {
          logout();
        } else {
          // Si aún le queda tiempo, verificamos con el backend para refrescar el 'lastCheck'
          checkAuthStatus();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authStatus, sessionStart, logout, checkAuthStatus]);

  return null;
};