import { create } from 'zustand'
import { AppRoles, type AuthResponse } from '../interfaces/authResponse.interface'
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { logoutAction } from '../actions/logout';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

const FIVE_MINUTES = 5 * 60 * 1000;

type AuthState = {
  // Properties
  user: AuthResponse | null,
  // token: string | null,
  authStatus: AuthStatus,
  lastCheck: number | null,

  // Getters
  isSuperAdmin: () => boolean,
  isBossCC: () => boolean,
  isCoordinator: () => boolean,
  isBoss: () => boolean,
  isTechnician: () => boolean,
  isPlaning: () => boolean,
  isSecretaryCC: () => boolean,

  // Actions
  login: (email: string, password: string) => Promise<boolean>,
  logout: () => Promise<void>,
  checkAuthStatus: () => Promise<boolean>,
}

const getRole = (get: () => AuthState): string => get().user?.role?.name ?? '';

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  authStatus: 'checking',
  lastCheck: null,

  // Getters
  isSuperAdmin:  () => getRole(get) === AppRoles.SuperAdmin,
  isBossCC:      () => getRole(get) === AppRoles.JefeCC,
  isCoordinator: () => getRole(get) === AppRoles.Coordinador,
  isBoss:        () => getRole(get) === AppRoles.JefeDepartamento,
  isTechnician:  () => getRole(get) === AppRoles.Tecnico,
  isPlaning:     () => getRole(get) === AppRoles.Planeacion,
  isSecretaryCC: () => getRole(get) === AppRoles.SecretariaCC,

  // Actions
  login: async (email, password) => {
    try {
      const data = await loginAction(email, password);
      set({ user: data, authStatus: 'authenticated', lastCheck: Date.now() });
      return true;
    } catch {
      set({ user: null, authStatus: 'not-authenticated', lastCheck: null });
      return false;
    }
  },

  logout: async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      set({ user: null, authStatus: 'not-authenticated', lastCheck: null });
    }
  },

  checkAuthStatus: async () => {
    const { lastCheck, authStatus, logout } = get();

    if (authStatus === 'authenticated' && lastCheck && Date.now() - lastCheck < FIVE_MINUTES) {
      return true;
    }

    try {
      const data = await checkAuthAction();
      set({ user: data, authStatus: 'authenticated', lastCheck: Date.now() });
      return true;
    } catch {
      await logout(); 
      return false;
    }
  },
}));