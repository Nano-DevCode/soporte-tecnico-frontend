import { RoleRoute, type UserRole } from "@/auth/routes/ProtectedRoutes";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { lazy } from "react";
import { useRoutes } from "react-router";

const DepartmentPage = lazy(() => import('./pages/DepartmentPage').then(m => ({ default: m.DepartmentPage })));
const DepartmentCreatePage = lazy(() => import('./pages/DepartmentCreatePage'));
const DepartmentDetailsPage = lazy(() => import('./pages/DepartmentDetailsPage'));
const DepartmentEditPage = lazy(() => import('./pages/DepartmentEditPage'));

const ALLOWED_ROLES: UserRole[] = [
  "isCoordinator", 
  "isBossCC", 
  "isSuperAdmin", 
  "isTechnician"
];

export const DepartmentRoutes = () => {
  return useRoutes([
    {
      index: true,
      element: (
        <SuspenseWrapper>
          <RoleRoute allowedRoles={[...ALLOWED_ROLES, "isVisitor"]}>
            <DepartmentPage />
          </RoleRoute>
        </SuspenseWrapper> 
      )
    },
    {
      path: 'create',
      element: (
        <SuspenseWrapper>
          <RoleRoute allowedRoles={ALLOWED_ROLES}>
            <DepartmentCreatePage />
          </RoleRoute>
        </SuspenseWrapper>
      )
    },
    {
      path: 'edit/:id',
      element: (
        <SuspenseWrapper>
          <RoleRoute allowedRoles={ALLOWED_ROLES}>
            <DepartmentEditPage />
          </RoleRoute>
        </SuspenseWrapper>
      )
    },
    {
      path: ':id',
      element: (
        <SuspenseWrapper>
          <RoleRoute allowedRoles={ALLOWED_ROLES}>
            <DepartmentDetailsPage />
          </RoleRoute>
        </SuspenseWrapper>
      )
    }
  ]);
};