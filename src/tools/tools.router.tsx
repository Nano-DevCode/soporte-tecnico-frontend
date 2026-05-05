import { lazy } from "react";
import { ToolCreatePage } from "./pages/ToolCreatePage";
import { ToolUpdatePage } from "./pages/ToolUpdatePage";
import { ToolDetailsPage } from "./pages/ToolDetailsPage";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";

const ToolPage = lazy(() => import('./pages/ToolPage').then(m => ({ default: m.ToolPage })));

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