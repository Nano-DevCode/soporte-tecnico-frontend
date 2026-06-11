import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useGetMyTicketFolioDepartment } from "../hooks/useGetMyTicketFolioDepartment";
import { useEffect } from "react";
import { sileo } from "sileo";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsTicketFolioSkeleton } from "../components/skeletons/DetailsTicketFolioSkeleton";
import { DetailsTicketFolio } from "../components/DetailsTicketFolio";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PencilLine } from "lucide-react";
import { useNavigate } from "react-router";
import { Can } from "@/common/permission/Can";

export const ViewMyTicketFolioDepartmentPage = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { navigateFallback } = useSmartNavigation('/folios/tickets');

    const { isLoading, isError, data: ticketFolio } = useGetMyTicketFolioDepartment();

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
                title={t('folios.tickets.view_my_department_page.title')}
                description={t('folios.tickets.view_my_department_page.description')}
                backLink={"/folios/tickets"}
            >
                <DetailsTicketFolioSkeleton />
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            title={t('folios.tickets.view_my_department_page.title')}
            description={t('folios.tickets.view_my_department_page.description')}
            backLink={"/folios/tickets"}
        >
            <DetailsTicketFolio ticketFolio={ticketFolio} >
                <Can permission={'EDIT_MY_TICKET_FOLIO_DEPARTMENT'}>
                    <Separator />
                    <CardFooter>
                        <Button
                            className="ml-auto"
                            variant={"default"}
                            onClick={() => navigate('/folios/tickets/my-department/edit')}
                        >
                            <PencilLine />
                            {t('folios.actions.config_folio')}
                        </Button>
                    </CardFooter>
                </Can>
            </DetailsTicketFolio>
        </CustomFormPageLayout>
    )
}
