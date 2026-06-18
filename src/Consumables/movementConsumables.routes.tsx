import { MovementDetailPage } from "./pages/MovementDetailPage";
import { MovementsPage } from "./pages/MovementsPage";

// import MovementConsumablesPage from "./pages/MovementConsumablePage";
export const movementConsumableRoutes = [
    {
        index: true,
        element: <MovementsPage />
    },
    {
        path: "details/:code_movement_aplication",
        element: <MovementDetailPage />
    },
];