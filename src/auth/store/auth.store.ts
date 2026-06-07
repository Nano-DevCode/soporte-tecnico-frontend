import { create } from 'zustand';
import { AppRoles, type AuthResponse } from '../interfaces/authResponse.interface';
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { logoutAction } from '../actions/logout';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

const FIVE_MINUTES = 5 * 60 * 1000;

type AuthState = {
  user: AuthResponse | null,
  authStatus: AuthStatus,
  lastCheck: number | null,
  sessionStart: number | null,

  isSuperAdmin: () => boolean,
  isBossCC: () => boolean,
  isCoordinator: () => boolean,
  isBoss: () => boolean,
  isTechnician: () => boolean,
  isPlaning: () => boolean,
  isSecretaryCC: () => boolean,

  login: (email: string, password: string) => Promise<boolean>,
  logout: () => Promise<void>,
  checkAuthStatus: () => Promise<boolean>,
}

const getRole = (get: () => AuthState): string => get().user?.role?.name ?? '';

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  authStatus: 'checking',
  lastCheck: null,
  sessionStart: null, // <-- INICIALIZAR

  isSuperAdmin:  () => getRole(get) === AppRoles.SuperAdmin,
  isBossCC:      () => getRole(get) === AppRoles.JefeCC,
  isCoordinator: () => getRole(get) === AppRoles.Coordinador,
  isBoss:        () => getRole(get) === AppRoles.JefeDepartamento,
  isTechnician:  () => getRole(get) === AppRoles.Tecnico,
  isPlaning:     () => getRole(get) === AppRoles.Planeacion,
  isSecretaryCC: () => getRole(get) === AppRoles.SecretariaCC,

  login: async (email, password) => {
    try {
      const data = await loginAction(email, password);
      // Establecemos AMBAS variables al momento del login
      set({ 
        user: data, 
        authStatus: 'authenticated', 
        lastCheck: Date.now(), 
        sessionStart: Date.now() 
      });
      return true;
    } catch {
      set({ user: null, authStatus: 'not-authenticated', lastCheck: null, sessionStart: null });
      return false;
    }
  },

  logout: async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      // Limpiamos todo al salir
      set({ user: null, authStatus: 'not-authenticated', lastCheck: null, sessionStart: null });
    }
  },

  checkAuthStatus: async () => {
    const { lastCheck, authStatus, logout, sessionStart } = get();

    if (authStatus === 'authenticated' && lastCheck && Date.now() - lastCheck < FIVE_MINUTES) {
      return true;
    }

    try {
      const data = await checkAuthAction();
      set({ 
        user: data, 
        authStatus: 'authenticated', 
        lastCheck: Date.now(),
        // Si la página se recargó y se perdió el store, tomamos Date.now(), de lo contrario mantenemos el original
        sessionStart: sessionStart || Date.now() 
      });
      return true;
    } catch {
      await logout(); 
      return false;
    }
  },
}));