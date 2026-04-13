import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { lazy } from "react";

const UserPage = lazy(() => import('./pages/UserPage').then(m => ({ default: m.UserPage })));
const UserCreatePage = lazy(() => import('./pages/UserCreatePage').then(m => ({ default: m.UserCreatePage })));
const UserDetailsPage = lazy(() => import('./pages/UserDetailsPage').then(m => ({ default: m.UserDetailsPage })));
const UserEditPage = lazy(() => import('./pages/UserEditPage').then(m => ({ default: m.UserEditPage })));

export const userRoutes = [
    {
        index: true,
        element: 
        <SuspenseWrapper>
           <UserPage /> 
        </SuspenseWrapper> 
    },
    {
        path: 'new',
        element: 
        <SuspenseWrapper>
           <UserCreatePage />
        </SuspenseWrapper> 
    },
    {
        path: 'details/:id',
        element: 
        <SuspenseWrapper>
           <UserDetailsPage />
        </SuspenseWrapper> 
    },
    {
        path: 'edit/:id',
        element: 
        <SuspenseWrapper>
           <UserEditPage/>
        </SuspenseWrapper> 
    }
];