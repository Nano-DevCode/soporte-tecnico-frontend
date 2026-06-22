import { createBrowserRouter, Navigate, RouterProvider } from "react-router"; 
import { lazy } from "react";
import { InicioPage } from "./inicio/pages/InicioPage";
import { AuthLayout } from './auth/layout/AuthLayout';
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./auth/routes/ProtectedRoutes";
import { UsersRoutes } from "./users/users.router";
import { SchoolPeriodsRoutes } from "./school-periods/school-periods.router";
import { CenterManagersRoutes } from "./computing-center-managers/center-manager.router";
import { DepartmentRoutes } from "./departments/departments.routes";
import { TicketsRoutes } from "./tickets/tickets.router";

import { equipmentRoutes } from "./Equipments/equipments.routes";
import { toolRoutes } from "./tools/tools.router";
import { ItAssetsRoutes } from "./it-assets/it-assets.router";
import { TechnicalReportsRoutes } from "./technical-reports/technical-reports.router";
import { FoliosRoutes } from "./folios/folio.router";
import { consumableRoutes } from "./Consumables/consumables.routes";
import { movementConsumableRoutes } from "./Consumables/movementConsumables.routes";
import { SuspenseWrapper } from "./components/custom/SuspenseWrapper";
import { AuthRoutes } from "./auth/auth.router";
import { AccountRoutes } from './account/account.router';
import { ToolsRoutes } from "./tools2/tools.router";

// const PanelLayout = lazy(() => import("./layout/PanelLayout"))
const PanelLayoutV2 = lazy(() => import("./layout/PanelLayoutV2"))

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthenticatedRoute>
                <SuspenseWrapper>
                    <PanelLayoutV2 />
                </SuspenseWrapper>
            </AuthenticatedRoute>
        ),
        children: [
            {
                index: true,
                element: <InicioPage />
            },
            {
                path: 'users/*',
                element: <UsersRoutes/>
            },
            {
                path: 'tickets',
                children: TicketsRoutes
            },
            {
                path: 'school-period',
                children: SchoolPeriodsRoutes
            },
            {
                path: 'center-managers',
                children: CenterManagersRoutes
            },
            {
                path: 'account/*',
                element: <AccountRoutes/>
            },
            {
                path: 'departments/*', 
                element: <DepartmentRoutes/>,
            },
            {
                path: 'equipments',
                children: equipmentRoutes,
            },
            {
                path: 'tools2',
                children: toolRoutes,
            },
            {
                path: 'tools/*',
                element: <ToolsRoutes/>
            },
            {
                path: 'technical-reports',
                children: TechnicalReportsRoutes,
            },
            {
                path: 'it-assets/*', 
                element: <ItAssetsRoutes/>
            },
            {
                path: 'folios',
                children: FoliosRoutes,
            },
            {
                path: 'consumables',
                children: consumableRoutes,
            },
            {
                path: 'consumable-movements',
                children: movementConsumableRoutes,
            },
        ],
    },
    {
        path: '/auth/*',
        element: (
            <NotAuthenticatedRoute>
                <AuthLayout />
            </NotAuthenticatedRoute>
        ),
        children: [
            {
                path: '*',
                element: <AuthRoutes/>
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to='/' />
    }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};