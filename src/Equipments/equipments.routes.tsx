import { lazy } from "react";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const EquipmentPage = lazy(() => import("./pages/EquipmentPage").then(module => ({ default: module.EquipmentPage })));
const CreateEquipmentPage = lazy(() => import("./pages/EquipmentCreate").then(module => ({ default: module.CreateEquipmentPage })));
const EquipmentDetailsPage = lazy(() => import("./pages/EquipmentDetailsPage").then(module => ({ default: module.EquipmentDetailsPage })));
const UpdateEquipmentPage = lazy(() => import("./pages/EquipmentUpdate").then(module => ({ default: module.UpdateEquipmentPage })));

export const equipmentRoutes = [
    {
        index: true,
        element: 
            <SuspenseWrapper>
                <EquipmentPage />
            </SuspenseWrapper>
    },
    {
        path: 'create',
        element: 
            <SuspenseWrapper>
                <CreateEquipmentPage />
            </SuspenseWrapper>
    },
    {
        path: 'details/:id',
        element: 
            <SuspenseWrapper>
                <EquipmentDetailsPage />
            </SuspenseWrapper>
    },
    {
        path: 'edit/:id',
        element: 
            <SuspenseWrapper>
                <UpdateEquipmentPage />
            </SuspenseWrapper>
    }
];