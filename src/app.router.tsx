import { createBrowserRouter, Navigate } from "react-router";
import { InicioPage } from "./inicio/pages/InicioPage";
import { AuthLayout } from './auth/layout/AuthLayout';
import { LoginPage } from "./auth/pages/LoginPage";
import { lazy } from "react";
import { ForgotPasswordPage } from "./auth/pages/ForgotPasswordPage";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "./auth/routes/ProtectedRoutes";
import { userRoutes } from "./users/users.router";
import { accountRoutes } from "./account/account.router";
import { departmentRoutes } from "./Departments/departments.routes";

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
                path: 'user',
                children: userRoutes,
            },
            {
                path: 'account',
                children: accountRoutes,
            },
            {
                path: 'department',
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
        children: [
            {
                index: true,
                element: <Navigate to='/auth/login'/>
            },
            {
                path: 'login',
                element: <LoginPage/>
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage/>
            },
        ]
    },
    {
        path: '*',
        element: <Navigate to='/'/>
    }
])