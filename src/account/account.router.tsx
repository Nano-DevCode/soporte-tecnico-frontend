import { lazy } from "react";
import { Navigate, useRoutes } from "react-router"; // ✅ Añadimos useRoutes
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ConfigurationPage = lazy(() => import("./pages/ConfigurationPage"));

export const AccountRoutes = () => {
    return useRoutes([
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
    ]);
};