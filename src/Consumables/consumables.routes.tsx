import { lazy } from "react";
import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const ConsumablePage = lazy(() => import('./pages/ConsumablePage').then(m => ({ default: m.ConsumablePage })));
const ConsumableCreatePage = lazy(() => import('./pages/ConsumableCreatePage').then(m => ({ default: m.ConsumableCreatePage })));
const ConsumableEditPage = lazy(() => import('./pages/ConsumableEditPage').then(m => ({ default: m.ConsumableEditPage })));
const ConsumableOutputPage = lazy(() => import('./pages/ConsumableOutputPage').then(m => ({ default: m.ConsumableOutputPage })));

// Páginas que usan exportación por defecto (default export)
const ConsumableDetailsPage = lazy(() => import('./pages/ConsumableDetailsPage'));
const CreateBatchPage = lazy(() => import('./pages/CreateBatchePage'));


export const consumableRoutes = [
    {
        index: true,
        element: (
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isSuperAdmin","isInventory","isBossCC","isCoordinator"]}>
                    <ConsumablePage />
                </RoleRoute>
            </SuspenseWrapper>
        )
    },
    {
        path: 'create',
        element: (
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isSuperAdmin","isInventory"]}>
                    <ConsumableCreatePage />
                </RoleRoute>
            </SuspenseWrapper>
        )
    },
    {
        path: 'edit/:id',
        element: (
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isSuperAdmin","isInventory"]}>
                    <ConsumableEditPage />
                </RoleRoute>
            </SuspenseWrapper>
        )
    },
    {
        path: 'details/:id',
        element: (
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isSuperAdmin","isInventory","isBossCC","isCoordinator"]}>
                    <ConsumableDetailsPage />
                </RoleRoute>
            </SuspenseWrapper>
        )
    },
    {
        path: 'batches/create',
        element: (
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isSuperAdmin","isInventory"]}>
                    <CreateBatchPage />
                </RoleRoute>
            </SuspenseWrapper>
        )
    },
    {
        path: 'consumables/outputs/create',
        element: (
            <SuspenseWrapper>
                <RoleRoute allowedRoles={["isSuperAdmin","isInventory"]}>
                    <ConsumableOutputPage />
                </RoleRoute>
            </SuspenseWrapper>
        )
    }
];
// import { ConsumableCreatePage } from "./pages/ConsumableCreatePage";
// // import { ConsumableDetailsPage } from "./pages/ConsumableDetailsPage";
// import { ConsumableEditPage } from "./pages/ConsumableEditPage";
// import { ConsumablePage } from "./pages/ConsumablePage";
// // import { CreateBatchPage } from "./pages/CreateBatchePage";
// import ConsumableDetailsPage from "./pages/ConsumableDetailsPage";
// import CreateBatchPage, {} from "./pages/CreateBatchePage";
// // import { CreateBatchForm } from "./components/CustomCreateBatchForm";
// import { ConsumableOutputPage } from "./pages/ConsumableOutputPage";
// import { RoleRoute } from "@/auth/routes/ProtectedRoutes";

// // import MovementConsumablesPage from "./pages/MovementConsumablesPage";

// export const consumableRoutes = [
//     {
//         index: true,
//         element:
//         <RoleRoute allowedRoles={["isCoordinator","isBossCC","isSuperAdmin"]}>
//         <ConsumablePage />
//         </RoleRoute>
//     },
//     {
//         path: 'create',
//         element: <ConsumableCreatePage />
//     },
//     {
//         path: 'edit/:id',
//         element: <ConsumableEditPage />
//     },
//     {
//         path: 'details/:id',
//         element: <ConsumableDetailsPage />
//     },
//     {
//         path: 'batches/create',
//         element: <CreateBatchPage />
//     },
//         {
//         path: 'consumables/outputs/create',
//         element: <ConsumableOutputPage />
//     }



// ];