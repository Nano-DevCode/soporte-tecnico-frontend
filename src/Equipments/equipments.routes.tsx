// import { DepartmentCreatePage } from "./pages/DepartmentCreatePage";
// import { DepartmentDetailsPage } from "./pages/DepartmentDetailsPage";
// import { DepartmentEditPage } from "./pages/DepartmentEditPage";
import { CreateEquipmentPage } from "./pages/EquipmentCreate";
import { EquipmentDetailsPage } from "./pages/EquipmentDetailsPage";
import { EquipmentPage } from "./pages/EquipmentPage";
import { UpdateEquipmentPage } from "./pages/EquipmentUpdate";

export const equipmentRoutes = [
    {
        index: true,
        element: <EquipmentPage />
    },
    {
        // Ruta para crear: usa la página que maneja el createEquipmentAsync
        path: 'create',
        element: <CreateEquipmentPage/>
    },
    {
        path: 'details/:id',
        element: <EquipmentDetailsPage />
    },
    {
        // Ruta para editar: usa la página que maneja el updateEquipmentAsync
        path: 'edit/:id',
        element: <UpdateEquipmentPage />
    }
];