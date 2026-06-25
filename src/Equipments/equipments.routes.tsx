import { lazy } from "react";
import { useRoutes } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoutePage } from "@/Consumables/permissions/CanRoute";

const EquipmentPage = lazy(() => import("./pages/EquipmentPage").then(module => ({ default: module.EquipmentPage })));
const CreateEquipmentPage = lazy(() => import("./pages/EquipmentCreate").then(module => ({ default: module.CreateEquipmentPage })));
const EquipmentDetailsPage = lazy(() => import("./pages/EquipmentDetailsPage").then(module => ({ default: module.EquipmentDetailsPage })));
const UpdateEquipmentPage = lazy(() => import("./pages/EquipmentUpdate").then(module => ({ default: module.UpdateEquipmentPage })));

export const EquipmentRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="VIEW_EQUIPMENTS_CATALOG">
                        <EquipmentPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'create',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="CREATE_EQUIPMENT">
                        <CreateEquipmentPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'details/:id',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="VIEW_DETAILS_EQUIPMENT">
                        <EquipmentDetailsPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'edit/:id',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="EDIT_EQUIPMENT">
                        <UpdateEquipmentPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        }
    ]);
};