import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { Dashboard } from "./pages/Dashboard";

export const DashboardRoutes = [
    {
        index: true,
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_DASHBOARD">
                    <Dashboard />
                </CanRoute>
            </SuspenseWrapper>
    }
];