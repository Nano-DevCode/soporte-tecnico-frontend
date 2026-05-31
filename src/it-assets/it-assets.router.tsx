import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { ItAssetsPage } from "./pages/ItAssetsPage";
import ItAssetsMovementOut from "./pages/ItAssetsMovementOut";
import ItAssetsMovementIn from "./pages/ItAssetsMovementIn";
import ItAssetsCreatePage from "./pages/ItAssetsCreatePage";

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
    }
]