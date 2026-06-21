import { Navigate, useRoutes } from "react-router"; // <-- Añadimos useRoutes
import { LoginPage } from "./pages/LoginPage";
import { lazy } from "react";

const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

export const AuthRoutes = () => {
    return useRoutes([
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
    ]);
};