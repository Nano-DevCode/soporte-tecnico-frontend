import { ListTicketPage } from "./pages/admin/ListTicketsPage";
import { AssignTicketPage } from "./pages/AssignTicketPage";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import { EditTicketPage } from "./pages/EditTicketPage";
import { FinishTicketPage } from "./pages/FinishTicketPage";
import { InterveneTicketPage } from "./pages/InterveneTicketPage";
import { RejectTicketPage } from "./pages/RejectTicketPage";
import { RouteTicketPage } from "./pages/RouteTicketPage";
import { ViewTicketPage } from "./pages/ViewTicketPage";


export const TicketsRoutes = [
    {
        index: true,
        element: <ListTicketPage />
    },
    {
        path: 'new',
        element: <CreateTicketPage />
    },
    {
        path: ':id',
        element: <ViewTicketPage />
    },
    {
        path: ':id/edit',
        element: <EditTicketPage />
    },
    {
        path: ':id/route',
        element: <RouteTicketPage />
    },
    {
        path: ':id/assign',
        element: <AssignTicketPage />
    },
    {
        path: ':id/intervene',
        element: <InterveneTicketPage />
    },
    {
        path: ':id/finish',
        element: <FinishTicketPage />
    },
    {
        path: ':id/reject',
        element: <RejectTicketPage />
    },
];