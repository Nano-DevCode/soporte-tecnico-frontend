import { Navigate, Route, Routes } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import ProfilePage from "./pages/ProfilePage";
import ConfigurationPage from "./pages/ConfigurationPage";

export const AccountRoutes = () => {
    return (
        <Routes>
            <Route
                index
                element={<Navigate to="profile" replace />}
            />
            <Route
                path="profile"
                element={
                    <SuspenseWrapper>
                        <ProfilePage />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="configuration"
                element={
                    <SuspenseWrapper>
                        <ConfigurationPage />
                    </SuspenseWrapper>
                }
            />
            <Route path="*" element={<Navigate to="profile" replace />} />
        </Routes>
    );
};