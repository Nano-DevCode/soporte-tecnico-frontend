import { lazy } from "react";
import { useRoutes } from "react-router";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoutePage } from "./permissions/CanRoute";

const MovementsPage = lazy(() => import('./pages/MovementsPage').then(m => ({ default: m.MovementsPage })));
const MovementDetailPage = lazy(() => import('./pages/MovementDetailPage').then(m => ({ default: m.MovementDetailPage })));

export const MovementConsumableRoutes = () => {
    return useRoutes([
        {
            index: true,
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="VIEW_MOVEMENTS_HISTORY">
                        <MovementsPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
        {
            path: "details/:code_movement_aplication",
            element: (
                <SuspenseWrapper>
                    <CanRoutePage permission="VIEW_MOVEMENT_DETAILS">
                        <MovementDetailPage />
                    </CanRoutePage>
                </SuspenseWrapper>
            )
        },
    ]);
};