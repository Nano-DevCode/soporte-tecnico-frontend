import { lazy } from "react";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { CreateTicketOnBehalfPage } from "./pages/CreateTicketOnBehalfPage";
import { ViewResponsePage } from "./pages/ViewResponsePage";
import { EditResponsePage } from "./pages/EditResponsePage";

const ListTicketPage = lazy(() => import("./pages/admin/ListTicketsPage").then(module => ({ default: module.ListTicketPage })));
const AssignTicketPage = lazy(() => import("./pages/AssignTicketPage").then(module => ({ default: module.AssignTicketPage })));
const CreateTicketPage = lazy(() => import("./pages/CreateTicketPage").then(module => ({ default: module.CreateTicketPage })));
const EditTicketPage = lazy(() => import("./pages/EditTicketPage").then(module => ({ default: module.EditTicketPage })));
const FinishTicketPage = lazy(() => import("./pages/FinishTicketPage").then(module => ({ default: module.FinishTicketPage })));
const InterveneTicketPage = lazy(() => import("./pages/InterveneTicketPage").then(module => ({ default: module.InterveneTicketPage })));
const RejectTicketPage = lazy(() => import("./pages/RejectTicketPage").then(module => ({ default: module.RejectTicketPage })));
const RouteTicketPage = lazy(() => import("./pages/RouteTicketPage").then(module => ({ default: module.RouteTicketPage })));
const ViewTicketPage = lazy(() => import("./pages/ViewTicketPage").then(module => ({ default: module.ViewTicketPage })));

export const TicketsRoutes = [
    {
        index: true,
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET_LIST">
                    <ListTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: 'new',
        element:
            <SuspenseWrapper>
                <CanRoute permission="CREATE_TICKET">
                    <CreateTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: 'on-behalf',
        element:
            <SuspenseWrapper>
                <CanRoute permission="CREATE_TICKET_ON_BEHALF">
                    <CreateTicketOnBehalfPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id',
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET">
                    <ViewTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_TICKET">
                    <EditTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/route',
        element:
            <SuspenseWrapper>
                <CanRoute permission="ROUTE_TICKET">
                    <RouteTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/assign',
        element:
            <SuspenseWrapper>
                <CanRoute permission="ASSIGN_TICKET">
                    <AssignTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/intervene',
        element:
            <SuspenseWrapper>
                <CanRoute permission="INTERVENE_TICKET">
                    <InterveneTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/finish',
        element:
            <SuspenseWrapper>
                <CanRoute permission="FINISH_TICKET">
                    <FinishTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/reject',
        element:
            <SuspenseWrapper>
                <CanRoute permission="REJECT_TICKET">
                    <RejectTicketPage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/response',
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_RESPONSE_REPORT">
                    <ViewResponsePage />
                </CanRoute>
            </SuspenseWrapper>
    },
    {
        path: ':id/response/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_RESPONSE_REPORT">
                    <EditResponsePage />
                </CanRoute>
            </SuspenseWrapper>
    },
];