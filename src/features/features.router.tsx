import { Navigate, Route, Routes } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { FutureFeaturesPage } from "./pages/FutureFeaturesPage";

export const FeaturesRoutes = () => {
    return (
        <Routes>
            <Route
                index
                element={
                    <SuspenseWrapper>
                        <FutureFeaturesPage />
                    </SuspenseWrapper>
                }
            />
            <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
    );
};
