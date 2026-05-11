import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { ListTicketPage } from "./pages/admin/ListTicketsPage";
import { AssignTicketPage } from "./pages/AssignTicketPage";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import { EditTicketPage } from "./pages/EditTicketPage";
import { FinishTicketPage } from "./pages/FinishTicketPage";
import { InterveneTicketPage } from "./pages/InterveneTicketPage";
import { RejectTicketPage } from "./pages/RejectTicketPage";
import { RouteTicketPage } from "./pages/RouteTicketPage";
import { ViewTicketPage } from "./pages/ViewTicketPage";
import { CanRoute } from "@/common/permission/CanRoute";


export const TicketsRoutes = [
    {
        index: true,
        element:

            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET_LIST">
                    <ListTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'new',
        element:
            <SuspenseWrapper>
                <CanRoute permission="CREATE_TICKET">
                    <CreateTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id',
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET">
                    <ViewTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_TICKET">
                    <EditTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/route',
        element:
            <SuspenseWrapper>
                <CanRoute permission="ROUTE_TICKET">
                    <RouteTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/assign',
        element:
            <SuspenseWrapper>
                <CanRoute permission="ASSIGN_TICKET">
                    <AssignTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/intervene',
        element:
            <SuspenseWrapper>
                <CanRoute permission="INTERVENE_TICKET">
                    <InterveneTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/finish',
        element:
            <SuspenseWrapper>
                <CanRoute permission="FINISH_TICKET">
                    <FinishTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/reject',
        element:
            <SuspenseWrapper>
                <CanRoute permission="REJECT_TICKET">
                    <RejectTicketPage />
                </CanRoute>
            </SuspenseWrapper >
    },
];