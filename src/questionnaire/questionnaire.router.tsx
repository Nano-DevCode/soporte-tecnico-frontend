import { RoleRoute, type UserRole } from "@/auth/routes/ProtectedRoutes";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { useRoutes } from "react-router";
import App from "./pages/App";

const ALLOWED_ROLES: UserRole[] = ["isCoordinator","isBossCC","isSuperAdmin"];

export const QuestionnaireRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <RoleRoute allowedRoles={[...ALLOWED_ROLES, "isVisitor"]}>
                        <App /> 
                    </RoleRoute>
                </SuspenseWrapper>
            )
        },
    ]);
};