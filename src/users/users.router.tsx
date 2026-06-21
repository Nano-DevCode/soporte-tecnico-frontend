import { RoleRoute, type UserRole } from "@/auth/routes/ProtectedRoutes";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { lazy } from "react";
import { useRoutes } from "react-router";
const UserPage = lazy(() => import('./pages/UserPage'));
const UserCreatePage = lazy(() => import('./pages/UserCreatePage'));
const UserDetailsPage = lazy(() => import('./pages/UserDetailsPage'));
const UserEditPage = lazy(() => import('./pages/UserEditPage'));

const ALLOWED_ROLES: UserRole[] = ["isCoordinator","isBossCC","isSuperAdmin"];

export const UsersRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <UserPage /> 
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'new',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <UserCreatePage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'edit/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <UserEditPage/>
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: ':id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <UserDetailsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
    ]);
};