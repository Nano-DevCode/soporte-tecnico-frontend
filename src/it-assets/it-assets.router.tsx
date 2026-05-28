import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { ItAssetsPage } from "./pages/ItAssetsPage";

export const itAssetRoutes = [
    {
        index: true,
        element: 
        <SuspenseWrapper>
            <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin", "isTechnician"]}>
                </RoleRoute>
            <ItAssetsPage />
        </SuspenseWrapper>
    },
]