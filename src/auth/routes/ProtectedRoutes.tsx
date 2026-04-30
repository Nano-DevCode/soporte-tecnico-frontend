import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth.store";
import { Navigate } from "react-router";

// 1. Ruta para usuarios que DEBEN estar autenticados
interface AuthRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

export const AuthenticatedRoute = ({ children, redirectTo = '/auth/login' }: AuthRouteProps) => {
  const { authStatus } = useAuthStore();
  
  if (authStatus === 'checking') return null;
  if (authStatus === 'not-authenticated') return <Navigate to={redirectTo} />;
  
  return children;
};

// 2. Ruta para usuarios que NO DEBEN estar autenticados (ej. Login)
export const NotAuthenticatedRoute = ({ children, redirectTo = '/' }: AuthRouteProps) => {
  const { authStatus } = useAuthStore();
  
  if (authStatus === 'checking') return null;
  if (authStatus === 'authenticated') return <Navigate to={redirectTo} />;
  
  return children;
};

// 3. Componente unificado para protección por Roles
interface RoleRouteProps extends PropsWithChildren {
  isAllowed: boolean;
  redirectTo?: string;
}

export const RoleRoute = ({ children, isAllowed, redirectTo = '/' }: RoleRouteProps) => {
  const { authStatus } = useAuthStore();
  
  if (authStatus === 'checking') return null;
  if (authStatus === 'not-authenticated') return <Navigate to='/auth/login' />;
  if (!isAllowed) return <Navigate to={redirectTo} />;
  
  return children;
};