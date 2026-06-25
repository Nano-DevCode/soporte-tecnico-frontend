import { lazy } from "react";
import { useRoutes } from "react-router";
import { CanRoutePage } from "./permissions/CanRoute";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

// Carga perezosa de las páginas
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
// import { lazy } from "react";
// import { useRoutes } from "react-router";
// import { RoleRoute } from "@/auth/routes/ProtectedRoutes";
// import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

// const ConsumablePage = lazy(() => import('./pages/ConsumablePage').then(m => ({ default: m.ConsumablePage })));
// const ConsumableCreatePage = lazy(() => import('./pages/ConsumableCreatePage').then(m => ({ default: m.ConsumableCreatePage })));
// const ConsumableEditPage = lazy(() => import('./pages/ConsumableEditPage').then(m => ({ default: m.ConsumableEditPage })));
// const ConsumableOutputPage = lazy(() => import('./pages/ConsumableOutputPage').then(m => ({ default: m.ConsumableOutputPage })));
// const ConsumableDetailsPage = lazy(() => import('./pages/ConsumableDetailsPage'));
// const CreateBatchPage = lazy(() => import('./pages/CreateBatchePage'));

// export const ConsumableRoutes = () => {
//     return useRoutes([
//         {
//             index: true,
//             element: (
//                 <SuspenseWrapper>
//                     <RoleRoute allowedRoles={["isSuperAdmin", "isInventory", "isBossCC", "isCoordinator"]}>
//                         <ConsumablePage />
//                     </RoleRoute>
//                 </SuspenseWrapper>
//             )
//         },
//         {
//             path: 'create',
//             element: (
//                 <SuspenseWrapper>
//                     <RoleRoute allowedRoles={["isSuperAdmin", "isInventory"]}>
//                         <ConsumableCreatePage />
//                     </RoleRoute>
//                 </SuspenseWrapper>
//             )
//         },
//         {
//             path: 'edit/:id',
//             element: (
//                 <SuspenseWrapper>
//                     <RoleRoute allowedRoles={["isSuperAdmin", "isInventory"]}>
//                         <ConsumableEditPage />
//                     </RoleRoute>
//                 </SuspenseWrapper>
//             )
//         },
//         {
//             path: 'details/:id',
//             element: (
//                 <SuspenseWrapper>
//                     <RoleRoute allowedRoles={["isSuperAdmin", "isInventory", "isBossCC", "isCoordinator"]}>
//                         <ConsumableDetailsPage />
//                     </RoleRoute>
//                 </SuspenseWrapper>
//             )
//         },
//         {
//             path: 'batches/create',
//             element: (
//                 <SuspenseWrapper>
//                     <RoleRoute allowedRoles={["isSuperAdmin", "isInventory"]}>
//                         <CreateBatchPage />
//                     </RoleRoute>
//                 </SuspenseWrapper>
//             )
//         },
//         {
//             path: 'consumables/outputs/create',
//             element: (
//                 <SuspenseWrapper>
//                     <RoleRoute allowedRoles={["isSuperAdmin", "isInventory"]}>
//                         <ConsumableOutputPage />
//                     </RoleRoute>
//                 </SuspenseWrapper>
//             )
//         }
//     ]);
// };
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