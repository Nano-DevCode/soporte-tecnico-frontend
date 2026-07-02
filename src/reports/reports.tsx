import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { ReportsPage } from "./page/ReportsPage";
export const ReportsRoutes = [
    {
        index: true,
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_REPORTS">
                    <ReportsPage />
                </CanRoute>
            </SuspenseWrapper>
    },
];