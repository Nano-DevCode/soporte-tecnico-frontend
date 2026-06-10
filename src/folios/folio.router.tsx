import { CanRoute } from "@/common/permission/CanRoute";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { ListTicketFolioDepartmentsPage } from "./pages/ListTicketFolioDepartmentsPage";
import { ViewTicketFolioDepartmentPage } from "./pages/ViewTicketFolioDepartmentPage";
import { EditTicketFolioDepartmentPage } from "./pages/EditTicketFolioDepartmentPage";
import { ViewMyTicketFolioDepartmentPage } from "./pages/ViewMyTicketFolioDepartmentPage";
import { EditMyTicketFolioDepartmentPage } from "./pages/EditMyTicketFolioDepartmentPage";
import { ViewResponseFolioPage } from "./pages/ViewResponseFolioPage";
import { EditResponseFolioPage } from "./pages/EditResponseFolioPage";

export const FoliosRoutes = [
    {
        index: true,
        path: 'tickets',
        element:

            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET_FOLIO_DEPARTMENTS_LIST">
                    <ListTicketFolioDepartmentsPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'tickets/:departmentId',
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET_FOLIO_DEPARTMENT_DETAILS">
                    <ViewTicketFolioDepartmentPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'tickets/:departmentId/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_TICKET_FOLIO_DEPARTMENT_DETAILS">
                    <EditTicketFolioDepartmentPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'tickets/my-department',
        element:
            <SuspenseWrapper>
                <CanRoute permission="WATCH_MY_TICKET_FOLIO_DEPARTMENT_DETAILS">
                    <ViewMyTicketFolioDepartmentPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'tickets/my-department/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_MY_TICKET_FOLIO_DEPARTMENT">
                    <EditMyTicketFolioDepartmentPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'responses',
        element:
            <SuspenseWrapper>
                <CanRoute permission="SHOW_RESPONSE_FOLIO_DETAILS">
                    <ViewResponseFolioPage />
                </CanRoute>
            </SuspenseWrapper >
    },
    {
        path: 'responses/edit',
        element:
            <SuspenseWrapper>
                <CanRoute permission="EDIT_RESPONSE_FOLIO">
                    <EditResponseFolioPage />
                </CanRoute>
            </SuspenseWrapper >
    }

    // // 🔹 Detalle de un Departamento Específico (/folios/solicitudes/:departmentId)
    // {
    //     path: 'solicitudes/:departmentId',
    //     element:
    //         <SuspenseWrapper>
    //             <CanRoute permission="WATCH_FOLIO_DEPARTMENT_DETAIL">
    //                 <DetailFolioDepartmentPage />
    //             </CanRoute>
    //         </SuspenseWrapper>
    // },
    // // 🔹 Edición (Ajuste) de un Departamento Específico (/folios/solicitudes/:departmentId/editar)
    // {
    //     path: 'solicitudes/:departmentId/editar',
    //     element:
    //         <SuspenseWrapper>
    //             <CanRoute permission="EDIT_FOLIO_DEPARTMENT">
    //                 <EditFolioDepartmentPage />
    //             </CanRoute>
    //         </SuspenseWrapper>
    // },

    // // 🔹 Detalle de Respuestas del CC (/folios/respuestas)
    // {
    //     path: 'respuestas',
    //     element:
    //         <SuspenseWrapper>
    //             <CanRoute permission="WATCH_FOLIO_RESPONSES">
    //                 <DetailFolioResponsesPage />
    //             </CanRoute>
    //         </SuspenseWrapper>
    // },
    // // 🔹 Edición de Respuestas del CC (/folios/respuestas/editar)
    // {
    //     path: 'respuestas/editar',
    //     element:
    //         <SuspenseWrapper>
    //             <CanRoute permission="EDIT_FOLIO_RESPONSES">
    //                 <EditFolioResponsesPage />
    //             </CanRoute>
    //         </SuspenseWrapper>
    // }


    //     import { CanRoute } from "@/common/permission/CanRoute";
    // import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
    // import { DetailMyFolioDepartmentPage } from "./pages/DetailMyFolioDepartmentPage";
    // import { EditMyFolioDepartmentPage } from "./pages/EditMyFolioDepartmentPage";

    // export const MyDepartmentFolioRoutes = [
    //     // 🔹 Ver su propio folio (/mi-departamento/folio)
    //     {
    //         index: true,
    //         element:
    //             <SuspenseWrapper>
    //                 <CanRoute permission="WATCH_OWN_FOLIO">
    //                     <DetailMyFolioDepartmentPage />
    //                 </CanRoute>
    //             </SuspenseWrapper>
    //     },
    //     // 🔹 Editar su propio folio (/mi-departamento/folio/editar)
    //     {
    //         path: 'editar',
    //         element:
    //             <SuspenseWrapper>
    //                 <CanRoute permission="EDIT_OWN_FOLIO">
    //                     <EditMyFolioDepartmentPage />
    //                 </CanRoute>
    //             </SuspenseWrapper>
    //     }
    // ];
];