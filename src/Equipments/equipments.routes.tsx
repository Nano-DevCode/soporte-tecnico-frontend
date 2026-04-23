// import { DepartmentCreatePage } from "./pages/DepartmentCreatePage";
// import { DepartmentDetailsPage } from "./pages/DepartmentDetailsPage";
// import { DepartmentEditPage } from "./pages/DepartmentEditPage";
import { EquipmentDetailsPage } from "./pages/EquipmentDetailsPage";
import { EquipmentPage } from "./pages/EquipmentPage";

export const equipmentRoutes = [
    {
        index: true,
        element: <EquipmentPage />
    },
    // {
    //     path: 'create',
    //     element: <DepartmentCreatePage />
    // },
    {
        path: 'details/:id',
        element: <EquipmentDetailsPage />
    },
    // {
    //     path: 'edit/:id',
    //     element: <DepartmentEditPage />
    // }
];