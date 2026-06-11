import { lazy } from "react";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";

const ItAssetsMovementOut = lazy(() => import("./pages/ItAssetsMovementOut"));
const ItAssetsMovementIn = lazy(() => import("./pages/ItAssetsMovementIn"));
const ItAssetsCreatePage = lazy(() => import("./pages/ItAssetsCreatePage"));
const ItAssetsUpdatePage = lazy(() => import("./pages/ItAssetsUpdatePage"));
const ItAssetsPage = lazy(() => import("./pages/ItAssetsPage").then(module => ({ default: module.ItAssetsPage })));
const ItAssetsMovementsPage = lazy(() => import("./pages/ItAssetsMovementsPage").then(module => ({ default: module.ItAssetsMovementsPage })));
const ItAssetsMovementViewPage = lazy(() => import("./pages/ItAssetsMovementViewPage").then(module => ({ default: module.ItAssetsMovementViewPage })));

export const itAssetRoutes = [
    {
        index: true,
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsPage />
            </SuspenseWrapper>
    },
    {
        path: 'new',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsCreatePage />
            </SuspenseWrapper>
    },
    {
        path: 'edit/:id',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsUpdatePage />
            </SuspenseWrapper>
    },
    {
        path: 'out/:id',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsMovementOut />
            </SuspenseWrapper>
    },
    {
        path: 'in/:id',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsMovementIn />
            </SuspenseWrapper>
    },
    {
        path: 'movements',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsMovementsPage />
            </SuspenseWrapper>
    },
    {
        path: 'movements/:id',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsMovementViewPage />
            </SuspenseWrapper>
    }
];