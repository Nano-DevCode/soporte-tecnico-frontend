
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
        path: 'create',
        element: <CreateEquipmentPage/>
    },
    {
        path: 'details/:id',
        element: <EquipmentDetailsPage />
    },
    {
        path: 'edit/:id',
        element: <UpdateEquipmentPage />
    }
];