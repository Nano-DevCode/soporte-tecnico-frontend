import { SuspenseWrapper } from "@/components/custom/SuspenseWrapper";
import { CanRoute } from "@/common/permission/CanRoute";
import { ListTechnicalReportsPage } from "./pages/ListTechnicalReportsPage";


export const TechnicalReportsRoutes = [
    {
        index: true,
        element:

            <SuspenseWrapper>
                <CanRoute permission="WATCH_TICKET_LIST">
                    <ListTechnicalReportsPage />
                </CanRoute>
            </SuspenseWrapper >
    },
];