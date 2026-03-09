import { Navigate } from "react-router";
import { ProfilePage } from "./pages/ProfilePage";
import { ConfigurationPage } from "./pages/ConfigurationPage";

export const accountRoutes = [
    {
        index: true,
        element: <Navigate to='/account/profile'/>
    },
    {
        path: 'profile',
        element: <ProfilePage />
    },
    {
        path: 'configuration',
        element: <ConfigurationPage />
    },
];