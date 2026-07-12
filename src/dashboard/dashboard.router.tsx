import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { lazy } from "react";
import { useRoutes } from "react-router";

const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));

export const DashboardRoutes = () => {
    return useRoutes([
        {
            index: true,
            element:
                <SuspenseWrapper>
                    <CanRoute permission="WATCH_DASHBOARD">
                        <Dashboard />
                    </CanRoute>
                </SuspenseWrapper>
        }
    ])
};