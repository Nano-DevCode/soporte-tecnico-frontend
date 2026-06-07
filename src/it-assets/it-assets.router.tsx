import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { ItAssetsPage } from "./pages/ItAssetsPage";
import ItAssetsMovementOut from "./pages/ItAssetsMovementOut";
import ItAssetsMovementIn from "./pages/ItAssetsMovementIn";
import ItAssetsCreatePage from "./pages/ItAssetsCreatePage";
import ItAssetsUpdatePage from "./pages/ItAssetsUpdatePage";
import { ItAssetsMovementsPage } from "./pages/ItAssetsMovementsPage";
import { ItAssetsMovementViewPage } from "./pages/ItAssetsMovementViewPage";

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
]