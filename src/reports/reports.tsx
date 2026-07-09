import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { lazy } from "react";
import { useRoutes } from "react-router";

const ReportsPage = lazy(() => import("./page/ReportsPage").then(module => ({ default: module.ReportsPage })));

export const ReportsRoutes = () => {
    return useRoutes([
        {
            index: true,
            element:
                <SuspenseWrapper>
                    <CanRoute permission="WATCH_REPORTS">
                        <ReportsPage />
                    </CanRoute>
                </SuspenseWrapper>
        },
    ])
};