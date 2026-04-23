import { CenterManagersPage } from "./pages/CenterManagersPage";
import { CreateCenterManagerPage } from "./pages/CreateCenterManagerPage";
import { EditCenterManagerPage } from "./pages/EditCenterManagerPage";
import { ViewCenterManagerPage } from "./pages/ViewCenterManagerPage";

export const CenterManagersRoutes = [
    {
        index: true,
        element: <CenterManagersPage />
    },
    {
        path: 'new',
        element: <CreateCenterManagerPage />
    },
    {
        path: ':id',
        element: <ViewCenterManagerPage />
    },
    {
        path: ':id/edit',
        element: <EditCenterManagerPage />
    },
];