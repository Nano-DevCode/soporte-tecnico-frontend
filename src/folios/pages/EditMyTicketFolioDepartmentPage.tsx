import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useGetMyTicketFolioDepartment } from "../hooks/useGetMyTicketFolioDepartment";
import { useEditMyTicketFolioDepartment } from "../hooks/useEditMyTicketFolioDepartment";
import { useEffect } from "react";
import { sileo } from "sileo";
import type { TicketFolioFormOutput } from "../schemas/UpdateTicketFolioDepartment.schema";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsTicketFolio } from "../components/DetailsTicketFolio";
import { TicketFolioForm } from "../components/forms/TicketFolioForm";

export const EditMyTicketFolioDepartmentPage = () => {

    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/folios/tickets/my-department');

    const { data: ticketFolio, isLoading, isError } = useGetMyTicketFolioDepartment();
    const { mutate, isPending, isSuccess } = useEditMyTicketFolioDepartment();

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

    const handleSubmit = (values: TicketFolioFormOutput) => {
        mutate({ editTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('folios.tickets.edit_page.success.title'),
                    description: t('folios.tickets.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack();
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('folios.tickets.edit_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack();
    };

    if (isLoading || !ticketFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.tickets.edit_my_department_page.title')}
                description={t('folios.tickets.edit_my_department_page.description')}
                backLink={"/folios/tickets/my-department"}
            >
                <></>
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            title={t('folios.tickets.edit_my_department_page.title')}
            description={t('folios.tickets.edit_my_department_page.description')}
            backLink={"/folios/tickets/my-department"}
        >
            <DetailsTicketFolio
                ticketFolio={ticketFolio}>

                <TicketFolioForm
                    itemFolio={ticketFolio}
                    isPending={isPending || isSuccess}
                    titleButton={t('common.buttons.save_changes')}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </DetailsTicketFolio>
        </CustomFormPageLayout>
    )
}
