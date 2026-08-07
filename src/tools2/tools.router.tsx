import { lazy } from "react";
import { useRoutes } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute, type UserRole } from "@/auth/routes/ProtectedRoutes";

const ToolsMovementOut = lazy(() => import("./pages/ToolsMovementOut"));
const ToolsMovementIn = lazy(() => import("./pages/ToolsMovementIn"));
const ToolsCreatePage = lazy(() => import("./pages/ToolsCreatePage"));
const ToolsUpdatePage = lazy(() => import("./pages/ToolsUpdatePage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const ToolsMovementsPage = lazy(() => import("./pages/ToolsMovementsPage"));
const ToolsMovementViewPage = lazy(() => import("./pages/ToolsMovementViewPage"));
const ToolsDetailsPage = lazy(() => import("./pages/ToolsDetailsPage"));

const ALLOWED_ROLES: UserRole[] = [
  "isCoordinator", 
  "isBossCC", 
  "isSuperAdmin", 
  "isTechnician",
  "isInventory"
];

export const ToolsRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={[...ALLOWED_ROLES, "isVisitor", "isSecretaryCC"]}>
                        <ToolsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'new',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ToolsCreatePage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'edit/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ToolsUpdatePage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'out/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ToolsMovementOut />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'in/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ToolsMovementIn />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'movements',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={[...ALLOWED_ROLES, "isVisitor", "isSecretaryCC"]}>
                        <ToolsMovementsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'movements/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={[...ALLOWED_ROLES, "isVisitor", "isSecretaryCC"]}>
                        <ToolsMovementViewPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: ':id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={[...ALLOWED_ROLES, "isVisitor", "isSecretaryCC"]}>
                        <ToolsDetailsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        }
    ]);
};