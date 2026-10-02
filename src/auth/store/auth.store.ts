import { create } from 'zustand';
import { AppRoles, type AuthResponse } from '../interfaces/authResponse.interface';
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { logoutAction } from '../actions/logout';
import { logoutAllAction } from '../actions/logout-all.action';
import { logError } from '@/utils/logger';
import { socket } from '../../tickets/websockets/socket';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

const THROTTLE_CHECK_MS = 60 * 1000; // 1 minuto para evitar peticiones simultáneas innecesarias

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
  isInventory: () => boolean,
  isVisitor: () => boolean,

  login: (email: string, password: string) => Promise<boolean>,
  logout: () => Promise<void>,
  logoutAll: () => Promise<void>,
  checkAuthStatus: () => Promise<boolean>,
}

const getRole = (get: () => AuthState): string => get().user?.role?.name ?? '';

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  authStatus: 'checking',
  lastCheck: null,
  sessionStart: null,

  isSuperAdmin:  () => getRole(get) === AppRoles.SuperAdmin,
  isBossCC:      () => getRole(get) === AppRoles.JefeCC,
  isCoordinator: () => getRole(get) === AppRoles.Coordinador,
  isBoss:        () => getRole(get) === AppRoles.JefeDepartamento,
  isTechnician:  () => getRole(get) === AppRoles.Tecnico,
  isPlaning:     () => getRole(get) === AppRoles.Planeacion,
  isSecretaryCC: () => getRole(get) === AppRoles.SecretariaCC,
  isInventory:   () => getRole(get) === AppRoles.Inventario,
  isVisitor:    () => getRole(get) === AppRoles.Visitor,

  login: async (email, password) => {
    try {
      const data = await loginAction(email, password);
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
      if (socket.connected) {
        socket.disconnect();
      }
      await logoutAction();
    } catch (error) {
      logError(error, "AuthStore", "Error al cerrar sesión");
    } finally {
      set({ user: null, authStatus: 'not-authenticated', lastCheck: null, sessionStart: null });
    }
  },

  logoutAll: async () => {
    try {
      if (socket.connected) {
        socket.disconnect();
      }
      await logoutAllAction();
    } catch (error) {
      logError(error, "AuthStore", "Error al cerrar todas las sesiones");
    } finally {
      set({ user: null, authStatus: 'not-authenticated', lastCheck: null, sessionStart: null });
    }
  },

  checkAuthStatus: async () => {
    const { lastCheck, authStatus, logout, sessionStart } = get();

    if (authStatus === 'authenticated' && lastCheck && Date.now() - lastCheck < THROTTLE_CHECK_MS) {
      return true;
    }

    if (authStatus === 'not-authenticated') {
      return false;
    }

    try {
      const data = await checkAuthAction();
      set({ 
        user: data, 
        authStatus: 'authenticated', 
        lastCheck: Date.now(),
        sessionStart: sessionStart || Date.now() 
      });
      return true;
    } catch {
      if (authStatus === 'authenticated') {
        await logout();
      } else {
        set({ user: null, authStatus: 'not-authenticated', lastCheck: null, sessionStart: null });
      }
      return false;
    }
  },
}));