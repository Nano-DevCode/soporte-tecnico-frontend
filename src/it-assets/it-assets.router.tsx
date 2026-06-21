import { lazy } from "react";
import { useRoutes } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute, type UserRole } from "@/auth/routes/ProtectedRoutes";

const ItAssetsMovementOut = lazy(() => import("./pages/ItAssetsMovementOut"));
const ItAssetsMovementIn = lazy(() => import("./pages/ItAssetsMovementIn"));
const ItAssetsCreatePage = lazy(() => import("./pages/ItAssetsCreatePage"));
const ItAssetsUpdatePage = lazy(() => import("./pages/ItAssetsUpdatePage"));
const ItAssetsPage = lazy(() => import("./pages/ItAssetsPage"));
const ItAssetsMovementsPage = lazy(() => import("./pages/ItAssetsMovementsPage"));
const ItAssetsMovementViewPage = lazy(() => import("./pages/ItAssetsMovementViewPage"));
const ItAssetsDetailsPage = lazy(() => import("./pages/ItAssetsDetailsPage"));

const ALLOWED_ROLES: UserRole[] = [
  "isCoordinator", 
  "isBossCC", 
  "isSuperAdmin", 
  "isTechnician"
];

export const ItAssetsRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'new',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsCreatePage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'edit/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsUpdatePage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'out/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsMovementOut />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'in/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsMovementIn />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'movements',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsMovementsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: 'movements/:id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsMovementViewPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
        {
            path: ':id',
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={ALLOWED_ROLES}>
                        <ItAssetsDetailsPage />
                    </RoleRoute>
                </SuspenseWrapper>
            )
        }
    ]);
};