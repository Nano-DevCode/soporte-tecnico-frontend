import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { useRoutes } from "react-router";
import { lazy } from "react";

const CenterManagersPage = lazy(() => import("./pages/CenterManagersPage").then(module => ({ default: module.CenterManagersPage })));
const CreateCenterManagerPage = lazy(() => import("./pages/CreateCenterManagerPage").then(module => ({ default: module.CreateCenterManagerPage })));
const ViewCenterManagerPage = lazy(() => import("./pages/ViewCenterManagerPage").then(module => ({ default: module.ViewCenterManagerPage })));
const EditCenterManagerPage = lazy(() => import("./pages/EditCenterManagerPage").then(module => ({ default: module.EditCenterManagerPage })));

export const CenterManagersRoutes = () => {
    return useRoutes([
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
    ])
};