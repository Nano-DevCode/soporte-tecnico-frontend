import { lazy } from "react";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const MovementsPage = lazy(() => import('./pages/MovementsPage').then(m => ({ default: m.MovementsPage })));
const MovementDetailPage = lazy(() => import('./pages/MovementDetailPage').then(m => ({ default: m.MovementDetailPage })));

// import { MovementDetailPage } from './pages/MovementDetailPage';
// import { MovementsPage } from './pages/MovementsPage';

// import MovementConsumablesPage from "./pages/MovementConsumablePage";
export const movementConsumableRoutes = [
    {
        index: true,
        element: (
            <SuspenseWrapper >
                <RoleRoute allowedRoles={["isSuperAdmin", "isInventory", "isBossCC", "isCoordinator"]}>
                    <MovementsPage />
                </RoleRoute >
            </SuspenseWrapper>
        )
    },
    {
        path: "details/:code_movement_aplication",
        element: (
            <SuspenseWrapper >
            <RoleRoute allowedRoles={["isSuperAdmin", "isInventory", "isBossCC", "isCoordinator"]}>
                <MovementDetailPage />
            </RoleRoute >
        </SuspenseWrapper>
        )
    },
];