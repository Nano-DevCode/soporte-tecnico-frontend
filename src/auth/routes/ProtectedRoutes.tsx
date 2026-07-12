import type { PropsWithChildren } from "react";
import { useAuthStore } from '../store/auth.store';
import { Navigate, useLocation } from "react-router";
import { useUserRoles } from "../hooks/useUserRoles";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore(state => state.authStatus);
  const location = useLocation();

  if (authStatus === 'checking') return null;
  if (authStatus === 'not-authenticated') {
    return <Navigate to='/auth/login' state={{ from: location }} replace />;
  }

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore(state => state.authStatus);

  if (authStatus === 'checking') return null;
  if (authStatus === 'authenticated') return <RedirectPerRole />;

  return children;
};

export type UserRole = keyof ReturnType<typeof useUserRoles>;

interface RoleRouteProps extends PropsWithChildren {
  allowedRoles: UserRole[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const roles = useUserRoles();
  const isAllowed = allowedRoles.some(role => roles[role]);

  if (!isAllowed) return <RedirectPerRole />;

  return children;
};

export const RedirectPerRole = () => {
  const {
    isBoss,
    isBossCC,
    isCoordinator,
    isPlaning,
    isSecretaryCC,
    isSuperAdmin,
    isTechnician,
    isVisitor,
    isInventory,
  } = useUserRoles();

  if (isSuperAdmin)  return <Navigate to='/' />;
  if (isBossCC)      return <Navigate to='/' />;
  if (isBoss)        return <Navigate to='/' />;
  if (isCoordinator) return <Navigate to='/' />;
  if (isPlaning)     return <Navigate to='/' />;
  if (isSecretaryCC) return <Navigate to='/' />;
  if (isTechnician)  return <Navigate to='/' />;
  if (isVisitor)  return <Navigate to='/' />;
  if (isInventory)   return <Navigate to= '/' />;

  return <Navigate to='/auth/login' />;
};