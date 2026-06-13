import { ConsumableCreatePage } from "./pages/ConsumableCreatePage";
// import { ConsumableDetailsPage } from "./pages/ConsumableDetailsPage";
import { ConsumableEditPage } from "./pages/ConsumableEditPage";
import { ConsumablePage } from "./pages/ConsumablePage";
// import { CreateBatchPage } from "./pages/CreateBatchePage";
import ConsumableDetailsPage from "./pages/ConsumableDetailsPage";
import CreateBatchePage from "./pages/CreateBatchePage";
import { ConsumableOutputPage } from "./pages/ConsumableOutputPage";

// import MovementConsumablesPage from "./pages/MovementConsumablesPage";

export const consumableRoutes = [
    {
        index: true,
        element: <ConsumablePage />
    },
    {
        path: 'create',
        element: <ConsumableCreatePage />
    },
    {
        path: 'edit/:id',
        element: <ConsumableEditPage />
    },
    {
        path: 'details/:id',
        element: <ConsumableDetailsPage />
    },
    {
        path: 'batches/create',
        element: <CreateBatchePage />
    },
        {
        path: 'consumables/outputs/create', 
        element: <ConsumableOutputPage />
    }



];