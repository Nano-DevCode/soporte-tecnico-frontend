import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth.store";
import { Navigate } from "react-router";

export const AuthenticatedRoute = ({children}: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>;

  return children;
}

export const NotAuthenticatedRoute = ({children}: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'authenticated') return <Navigate to='/'/>;

  return children;
}

export const SuperAdmiRoute = ({children}: PropsWithChildren) => {
  const { authStatus, isSuperAdmin } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>;

  if(!isSuperAdmin()) return <Navigate to='/'/>;

  return children;
}

export const AdmiRoute = ({children}: PropsWithChildren) => {
  const { authStatus, isAdmin } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>;

  if(!isAdmin()) return <Navigate to='/'/>;

  return children;
}

export const CoordinatorRoute = ({children}: PropsWithChildren) => {
  const { authStatus, isCoordinator } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>;

  if(!isCoordinator()) return <Navigate to='/'/>;

  return children;
}

export const BossRoute = ({children}: PropsWithChildren) => {
  const { authStatus, isBoss } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>;

  if(!isBoss()) return <Navigate to='/'/>;

  return children;
}

export const TechnicianRoute = ({children}: PropsWithChildren) => {
  const { authStatus, isTechnician } = useAuthStore();
  if(authStatus === 'checking') return null;

  if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>;

  if(!isTechnician()) return <Navigate to='/'/>;

  return children;
}

