import { lazy } from "react";
import { CanRoute } from "@/common/permission/CanRoute";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { useRoutes } from "react-router";

const ListTicketFolioDepartmentsPage = lazy(() => import("./pages/ListTicketFolioDepartmentsPage").then(module => ({ default: module.ListTicketFolioDepartmentsPage })));
const ViewTicketFolioDepartmentPage = lazy(() => import("./pages/ViewTicketFolioDepartmentPage").then(module => ({ default: module.ViewTicketFolioDepartmentPage })));
const EditTicketFolioDepartmentPage = lazy(() => import("./pages/EditTicketFolioDepartmentPage").then(module => ({ default: module.EditTicketFolioDepartmentPage })));
const ViewMyTicketFolioDepartmentPage = lazy(() => import("./pages/ViewMyTicketFolioDepartmentPage").then(module => ({ default: module.ViewMyTicketFolioDepartmentPage })));
const EditMyTicketFolioDepartmentPage = lazy(() => import("./pages/EditMyTicketFolioDepartmentPage").then(module => ({ default: module.EditMyTicketFolioDepartmentPage })));
const ViewResponseFolioPage = lazy(() => import("./pages/ViewResponseFolioPage").then(module => ({ default: module.ViewResponseFolioPage })));
const EditResponseFolioPage = lazy(() => import("./pages/EditResponseFolioPage").then(module => ({ default: module.EditResponseFolioPage })));

export const FoliosRoutes = () => {
    return useRoutes([
        {
            index: true,
            path: 'tickets',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="WATCH_TICKET_FOLIO_DEPARTMENTS_LIST">
                        <ListTicketFolioDepartmentsPage />
                    </CanRoute>
                </SuspenseWrapper >
        },
        {
            path: 'tickets/:departmentId',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="WATCH_TICKET_FOLIO_DEPARTMENT_DETAILS">
                        <ViewTicketFolioDepartmentPage />
                    </CanRoute>
                </SuspenseWrapper >
        },
        {
            path: 'tickets/:departmentId/edit',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="EDIT_TICKET_FOLIO_DEPARTMENT_DETAILS">
                        <EditTicketFolioDepartmentPage />
                    </CanRoute>
                </SuspenseWrapper >
        },
        {
            path: 'tickets/my-department',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="WATCH_MY_TICKET_FOLIO_DEPARTMENT_DETAILS">
                        <ViewMyTicketFolioDepartmentPage />
                    </CanRoute>
                </SuspenseWrapper >
        },
        {
            path: 'tickets/my-department/edit',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="EDIT_MY_TICKET_FOLIO_DEPARTMENT">
                        <EditMyTicketFolioDepartmentPage />
                    </CanRoute>
                </SuspenseWrapper >
        },
        {
            path: 'responses',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="SHOW_RESPONSE_FOLIO_DETAILS">
                        <ViewResponseFolioPage />
                    </CanRoute>
                </SuspenseWrapper >
        },
        {
            path: 'responses/edit',
            element:
                <SuspenseWrapper>
                    <CanRoute permission="EDIT_RESPONSE_FOLIO">
                        <EditResponseFolioPage />
                    </CanRoute>
                </SuspenseWrapper >
        }
    ])
};