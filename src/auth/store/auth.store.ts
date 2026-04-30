import { create } from 'zustand'
import { AppRoles, type AuthResponse } from '../interfaces/authResponse.interface'
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

type AuthState = {
  // Properties
  user: AuthResponse | null,
  token: string | null,
  authStatus: AuthStatus,

  // Getters
  isSuperAdmin: () => boolean,
  isBossCC: () => boolean,
  isCoordinator: () => boolean,
  isBoss: () => boolean,
  isTechnician: () => boolean,
  isPlaning: () => boolean,
  isSecretaryCC: () => boolean,


  // Actions
  login: (email: string, password:string) => Promise<boolean>,
  logout: () => void,
  checkAuthStatus: () => Promise<boolean>,
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  authStatus: 'checking',

  // Getters
  isSuperAdmin() {
    const role = get().user?.role.name || '';
    return role === AppRoles.SuperAdmin ? true : false;
  },
  isBossCC: () => {
    const role = get().user?.role.name || '';
    return role === AppRoles.JefeCC ? true : false;
  },
  isCoordinator: () => {
    const role = get().user?.role.name || '';
    return role === AppRoles.Coordinador ? true : false;
  },
  isBoss: () => {
    const role = get().user?.role.name || '';
    return role === AppRoles.JefeDepartamento ? true : false;
  },
  isTechnician: () => {
    const role = get().user?.role.name || '';
    return role === AppRoles.Tecnico ? true : false;
  },
  isPlaning: () => {
    const role = get().user?.role.name || '';
    return role === AppRoles.Planeacion ? true : false;
  },
  isSecretaryCC: () => {
    const role = get().user?.role.name || '';
    return role === AppRoles.SecretariaCC ? true : false;
  },

  // Actions
  login: async (email: string, password:string) => {
    try {
      const data = await loginAction(email, password);

      localStorage.setItem('token', data.token);
      set({user: data, token: data.token, authStatus: 'authenticated'});
      return true;
    }catch {
      set({user: null, token: null, authStatus: 'not-authenticated'});
      localStorage.removeItem('token');
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({user: null, token: null, authStatus: 'not-authenticated'});
  },
  checkAuthStatus: async () => {
    try {
      const data = await checkAuthAction();
      set({user:data, token: data.token, authStatus: 'authenticated'});
      return true;
    } catch {
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated'
      });
      return false;
    }
  },

}))
