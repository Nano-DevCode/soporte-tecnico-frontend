import { DepartmentCreatePage } from "./pages/DepartmentCreatePage";
import { DepartmentDetailsPage } from "./pages/DepartmentDetailsPage";
import { DepartmentEditPage } from "./pages/DepartmentEditPage";
import { DepartmentPage } from "./pages/DepartmentPage";

export const departmentRoutes = [
    {
        index: true,
        element: <DepartmentPage />
    },
    {
        path: 'create',
        element: <DepartmentCreatePage />
    },
    {
        path: 'details/:id',
        element: <DepartmentDetailsPage />
    },
    {
        path: 'edit/:id',
        element: <DepartmentEditPage />
    }
];