import { useParams } from "react-router";
import { DetailsTicketFolio } from "../components/DetailsTicketFolio"
import { useTranslation } from "react-i18next";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useGetTicketFolioByIdDepartment } from "../hooks/useGetTicketFolioByIdDepartment";
import { useEffect } from "react";
import { sileo } from "sileo";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsTicketFolioSkeleton } from "../components/skeletons/DetailsTicketFolioSkeleton";

export const ViewTicketFolioDepartmentPage = () => {
    const { departmentId } = useParams();
    const { t } = useTranslation();
    const { navigateFallback } = useSmartNavigation('/folios/tickets');

    const { isLoading, isError, data: ticketFolio } = useGetTicketFolioByIdDepartment(departmentId);

    useEffect(() => {
        if (isLoading) return;

        if (isError || !ticketFolio) {
            sileo.error({
                title: t('folios.tickets.not_found.title'),
                description: t('folios.tickets.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, t, navigateFallback, ticketFolio]);


    if (isLoading || !ticketFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.tickets.view_page.title')}
                description={t('folios.tickets.view_page.description')}
                backLink={"/folios/tickets"}
            >
                <DetailsTicketFolioSkeleton />
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            title={t('folios.tickets.view_page.title')}
            description={t('folios.tickets.view_page.description')}
            backLink={"/folios/tickets"}
        >
            <DetailsTicketFolio ticketFolio={ticketFolio} />
        </CustomFormPageLayout>
    )
}
