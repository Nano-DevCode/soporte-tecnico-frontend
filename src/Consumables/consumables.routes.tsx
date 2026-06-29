import { lazy } from "react";
import { useRoutes } from "react-router";
import { CanRoutePage } from "./permissions/CanRoute";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const ConsumablePage = lazy(() => import('./pages/ConsumablePage').then(m => ({ default: m.ConsumablePage })));
const ConsumableCreatePage = lazy(() => import('./pages/ConsumableCreatePage').then(m => ({ default: m.ConsumableCreatePage })));
const ConsumableEditPage = lazy(() => import('./pages/ConsumableEditPage').then(m => ({ default: m.ConsumableEditPage })));
const ConsumableOutputPage = lazy(() => import('./pages/ConsumableOutputPage').then(m => ({ default: m.ConsumableOutputPage })));
const ConsumableDetailsPage = lazy(() => import('./pages/ConsumableDetailsPage'));
const CreateBatchPage = lazy(() => import('./pages/CreateBatchePage'));

export const ConsumableRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="VIEW_CONSUMABLES_CATALOG">
                        <ConsumablePage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'create',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="CREATE_CONSUMABLE">
                        <ConsumableCreatePage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'edit/:id',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="EDIT_CONSUMABLE">
                        <ConsumableEditPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'details/:id',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="VIEW_CONSUMABLE_DETAILS">
                        <ConsumableDetailsPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'batches/create',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="CREATE_BATCH">
                        <CreateBatchPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: 'consumables/outputs/create',
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="CREATE_CONSUMABLE_OUTPUT">
                        <ConsumableOutputPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        }
    ]);
};
