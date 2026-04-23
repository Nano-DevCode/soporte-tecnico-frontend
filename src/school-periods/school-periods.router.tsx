import { CreateSchoolPeriodPage } from "./pages/CreateSchoolPeriodPage";
import { EditSchoolPeriodPage } from "./pages/EditSchoolPeriodPage";
import { SchoolPeriodsPage } from "./pages/SchoolPeriodsPage";
import { SchoolPeriodViewPage } from "./pages/SchoolPeriodViewPage";


export const SchoolPeriodsRoutes = [
    {
        index: true,
        element: <SchoolPeriodsPage />
    },
    {
        path: 'new',
        element: <CreateSchoolPeriodPage />
    },
    {
        path: ':id',
        element: <SchoolPeriodViewPage />
    },
    {
        // Ruta para editar
        path: ':id/edit',
        element: <EditSchoolPeriodPage />
    },
];