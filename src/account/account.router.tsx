import { lazy } from "react";
import { Navigate } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const ProfilePage = lazy(() => import("./pages/ProfilePage").then(module => ({ default: module.ProfilePage })));
const ConfigurationPage = lazy(() => import("./pages/ConfigurationPage").then(module => ({ default: module.ConfigurationPage })));

export const accountRoutes = [
    {
        index: true,
        element: <Navigate to='/account/profile'/>
    },
    {
        path: 'profile',
        element: 
            <SuspenseWrapper>
                <ProfilePage />
            </SuspenseWrapper>
    },
    {
        path: 'configuration',
        element: 
            <SuspenseWrapper>
                <ConfigurationPage />
            </SuspenseWrapper>
    },
];