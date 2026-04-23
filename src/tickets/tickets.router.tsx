import { ListTicketPage } from "./pages/admin/ListTicketsPage";
import { AssignTicketPage } from "./pages/AssignTicketPage";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import { FinishTicketPage } from "./pages/FinishTicketPage";
import { InterveneTicketPage } from "./pages/InterveneTicketPage";
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
    // {
    //     path: ':id/edit',
    //     element: <EditCenterManagerPage />
    // },
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
];