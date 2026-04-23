import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { lazy } from "react";

const DepartmentPage = lazy(() => import('./pages/DepartmentPage').then(m => ({ default: m.DepartmentPage })));
const DepartmentCreatePage = lazy(() => import('./pages/DepartmentCreatePage').then(m => ({ default: m.DepartmentCreatePage })));
const DepartmentDetailsPage = lazy(() => import('./pages/DepartmentDetailsPage').then(m => ({ default: m.DepartmentDetailsPage })));
const DepartmentEditPage = lazy(() => import('./pages/DepartmentEditPage').then(m => ({ default: m.DepartmentEditPage })));

export const departmentRoutes = [
    {
        index: true,
        element:
        <SuspenseWrapper>
            <DepartmentPage />
        </SuspenseWrapper> 
    },
    {
        path: 'create',
        element: 
        <SuspenseWrapper>
            <DepartmentCreatePage />
        </SuspenseWrapper>
    },
    {
        path: 'edit/:id',
        element: 
        <SuspenseWrapper>
            <DepartmentEditPage />
        </SuspenseWrapper>
    },
    {
        path: ':id',
        element:
        <SuspenseWrapper>
            <DepartmentDetailsPage />
        </SuspenseWrapper>
    }
];