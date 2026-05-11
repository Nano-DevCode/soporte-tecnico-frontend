import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CenterManagersPage } from "./pages/CenterManagersPage";
import { CreateCenterManagerPage } from "./pages/CreateCenterManagerPage";
import { EditCenterManagerPage } from "./pages/EditCenterManagerPage";
import { ViewCenterManagerPage } from "./pages/ViewCenterManagerPage";
import { CanRoute } from "@/common/permission/CanRoute";

export const CenterManagersRoutes = [
    {
        index: true,
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_MANAGER_LIST">
                    <CenterManagersPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'new',
        element:
            <SuspenseWrapper>
                <CanRoute permission="CREATE_MANAGER">
                    <CreateCenterManagerPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id',
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_MANAGER">
                    <ViewCenterManagerPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: ':id/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_MANAGER">
                    <EditCenterManagerPage />
                </CanRoute>
            </SuspenseWrapper >
    },
];