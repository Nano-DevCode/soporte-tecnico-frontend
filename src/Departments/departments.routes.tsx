import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { lazy } from "react";

const DepartmentPage = lazy(() => import('./pages/DepartmentPage').then(m => ({ default: m.DepartmentPage })));
const DepartmentCreatePage = lazy(() => import('./pages/DepartmentCreatePage').then(m => ({ default: m.DepartmentCreatePage })));
const DepartmentDetailsPage = lazy(() => import('./pages/DepartmentDetailsPage').then(m => ({ default: m.DepartmentDetailsPage })));
const DepartmentEditPage = lazy(() => import('./pages/DepartmentEditPage').then(m => ({ default: m.DepartmentEditPage })));

export const departmentRoutes = [
    {
        index: true,
        element:
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin"]}>
                <DepartmentPage />
            </RoleRoute>
        </SuspenseWrapper> 
    },
    {
        path: 'create',
        element: 
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin"]}>
                <DepartmentCreatePage />
            </RoleRoute>
        </SuspenseWrapper>
    },
    {
        path: 'edit/:id',
        element: 
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin"]}>
                <DepartmentEditPage />
            </RoleRoute>
        </SuspenseWrapper>
    },
    {
        path: ':id',
        element:
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin"]}>
                <DepartmentDetailsPage />
            </RoleRoute>
        </SuspenseWrapper>
    }
];