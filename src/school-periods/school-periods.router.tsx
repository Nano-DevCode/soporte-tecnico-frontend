import { lazy } from "react";
import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";

const SchoolPeriodsPage = lazy(() => import("./pages/SchoolPeriodsPage").then(module => ({ default: module.SchoolPeriodsPage })));
const CreateSchoolPeriodPage = lazy(() => import("./pages/CreateSchoolPeriodPage").then(module => ({ default: module.CreateSchoolPeriodPage })));
const SchoolPeriodViewPage = lazy(() => import("./pages/SchoolPeriodViewPage").then(module => ({ default: module.SchoolPeriodViewPage })));
const EditSchoolPeriodPage = lazy(() => import("./pages/EditSchoolPeriodPage").then(module => ({ default: module.EditSchoolPeriodPage })));

export const SchoolPeriodsRoutes = [
    {
        index: true,
        element: 
            <SuspenseWrapper>
                <SchoolPeriodsPage />
            </SuspenseWrapper>
    },
    {
        path: 'new',
        element: 
            <SuspenseWrapper>
                <CreateSchoolPeriodPage />
            </SuspenseWrapper>
    },
    {
        path: ':id',
        element: 
            <SuspenseWrapper>
                <SchoolPeriodViewPage />
            </SuspenseWrapper>
    },
    {
        // Ruta para editar
        path: ':id/edit',
        element: 
            <SuspenseWrapper>
                <EditSchoolPeriodPage />
            </SuspenseWrapper>
    },
];