import { createBrowserRouter, Navigate } from "react-router";
import { InicioPage } from "./inicio/pages/InicioPage";
import { AuthLayout } from './auth/layout/AuthLayout';
import { lazy } from "react";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./auth/routes/ProtectedRoutes";
import { userRoutes } from "./users/users.router";
import { accountRoutes } from "./account/account.router";
import { SchoolPeriodsRoutes } from "./school-periods/school-periods.router";
import { CenterManagersRoutes } from "./computing-center-managers/center-manager.router";
import { departmentRoutes } from "./Departments/departments.routes";
import { TicketsRoutes } from "./tickets/tickets.router";
import { authRoutes } from "./auth/auth.router";
import { equipmentRoutes } from "./Equipments/equipments.routes";
import { toolRoutes } from "./tools/tools.router";
import { itAssetRoutes } from "./it-assets/it-assets.router";
import { TechnicalReportsRoutes } from "./technical-reports/technical-reports.router";
import { FoliosRoutes } from "./folios/folio.router";
import { consumableRoutes } from "./Consumables/consumables.routes";
import { movementConsumableRoutes } from "./Consumables/movementConsumables.routes";

// TODO: proteger rutas dependiendo del status del ticket
// const PanelLayout = lazy(() => import("./layout/PanelLayout"))
const PanelLayoutV2 = lazy(() => import("./layout/PanelLayoutV2"))

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthenticatedRoute>
                <PanelLayoutV2 />
            </AuthenticatedRoute>
        ),
        children: [
            {
                index: true,
                element: <InicioPage />
            },
            {
                path: 'users',
                children: userRoutes,
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
                path: 'account',
                children: accountRoutes,
            },
            {
                path: 'departments',
                children: departmentRoutes,
            },
            {
                path: 'equipments',
                children: equipmentRoutes,
            },
            {
                path: 'tools',
                children: toolRoutes,
            },
            {
                path: 'technical-reports',
                children: TechnicalReportsRoutes,
            },
            {
                path: 'it-assets',
                children: itAssetRoutes,
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
    // Auth Routes
    {
        path: '/auth',
        element:
            <NotAuthenticatedRoute>
                <AuthLayout />
            </NotAuthenticatedRoute>,
        children: authRoutes
    },
    {
        path: '*',
        element: <Navigate to='/' />
    }
])