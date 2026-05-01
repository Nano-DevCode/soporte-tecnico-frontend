import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';


const HOURS_MS = 2 * 60 * 60 * 1000;

export const SessionTimer = () => {
  const { authStatus, lastCheck, logout, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (authStatus === 'authenticated' && lastCheck) {
      timer = setTimeout(() => {
        logout();
      }, HOURS_MS);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authStatus, lastCheck, logout]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authStatus === 'authenticated') {
        checkAuthStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authStatus, checkAuthStatus]);

  return null;
};