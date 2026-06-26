import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { ListTechnicalReportsPage } from "./pages/ListTechnicalReportsPage";
import { ViewTechnicalReportPage } from "./pages/ViewTechnicalReportPage";
import { EditTechnicalReportPage } from "./pages/EditTechnicalReportPage";


export const TechnicalReportsRoutes = [
    {
        index: true,
        element:

            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET_LIST">
                    <ListTechnicalReportsPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id',
        element:

            <SuspenseWrapper>
                <CanRoute permission="WATCH_TECHNICAL_REPORT">
                    <ViewTechnicalReportPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/edit',
        element:

            <SuspenseWrapper>
                <CanRoute permission="EDIT_TECHNICAL_REPORT">
                    <EditTechnicalReportPage />
                </CanRoute>
            </SuspenseWrapper >
    },
];