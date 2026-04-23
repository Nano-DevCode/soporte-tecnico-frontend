import { Navigate } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { lazy } from "react";

const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));


export const authRoutes = [
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