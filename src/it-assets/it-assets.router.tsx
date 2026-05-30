import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { ItAssetsPage } from "./pages/ItAssetsPage";
import ItAssetsMovementOut from "./pages/ItAssetsMovementOut";

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
        path: 'out/:id',
        element: 
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}/>
                <ItAssetsMovementOut />
            </SuspenseWrapper>
    }
]