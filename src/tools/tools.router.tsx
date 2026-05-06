import { lazy } from "react";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";

const ToolPage = lazy(() => import('./pages/ToolPage').then(m => ({ default: m.ToolPage })));
const ToolCreatePage = lazy(() => import('./pages/ToolCreatePage').then(m => ({ default: m.ToolCreatePage })));
const ToolUpdatePage = lazy(() => import('./pages/ToolUpdatePage').then(m => ({ default: m.ToolUpdatePage })));
const ToolDetailsPage = lazy(() => import('./pages/ToolDetailsPage').then(m => ({ default: m.ToolDetailsPage })));

export const toolRoutes = [
    {
        index: true,
        element: 
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}>
                </RoleRoute>
            <ToolPage />
        </SuspenseWrapper>
    },
    {
        path: 'new',
        element: 
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}>
                <ToolCreatePage/>
            </RoleRoute >
        </SuspenseWrapper>
    },
    {
        path: 'edit/:id',
        element: 
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}>
                <ToolUpdatePage />
            </RoleRoute >
        </SuspenseWrapper>
    },
    {
        path: ':id',
        element:
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}>
                <ToolDetailsPage/>
            </RoleRoute >
        </SuspenseWrapper>
    }
]