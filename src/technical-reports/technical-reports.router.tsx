import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { lazy } from "react";
import { useRoutes } from "react-router";
const ListTechnicalReportsPage = lazy(() => import("./pages/ListTechnicalReportsPage").then(module => ({ default: module.ListTechnicalReportsPage })));
const ViewTechnicalReportPage = lazy(() => import("./pages/ViewTechnicalReportPage").then(module => ({ default: module.ViewTechnicalReportPage })));
const EditTechnicalReportPage = lazy(() => import("./pages/EditTechnicalReportPage").then(module => ({ default: module.EditTechnicalReportPage })));


export const TechnicalReportsRoutes = () => {
    return useRoutes([
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
    ])
};