import { createBrowserRouter, Navigate } from "react-router";
import { InicioPage } from "./inicio/pages/InicioPage";
import { AuthLayout } from './auth/layout/AuthLayout';
import { lazy } from "react";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./auth/routes/ProtectedRoutes";
import { userRoutes } from "./users/users.router";
import { accountRoutes } from "./account/account.router";
import { departmentRoutes } from "./Departments/departments.routes";
import { authRoutes } from "./auth/auth.router";

const PanelLayout = lazy(() => import("./layout/PanelLayout"))

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthenticatedRoute>
                <PanelLayout />
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
                path: 'account',
                children: accountRoutes,
            },
            {
                path: 'departments',
                children: departmentRoutes,
            }
        ],
    },
    // Auth Routes
    {
        path: '/auth',
        element: 
            <NotAuthenticatedRoute>
                <AuthLayout/>
            </NotAuthenticatedRoute>,
        children: authRoutes
    },
    {
        path: '*',
        element: <Navigate to='/'/>
    }
])