import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useGetTicketFolioByIdDepartment } from "../hooks/useGetTicketFolioByIdDepartment";
import { sileo } from "sileo";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { useEffect } from "react";
import { useEditTicketFolioDepartment } from "../hooks/useEditTicketFolioDepartment";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { TicketFolioForm } from "../components/forms/TicketFolioForm";
import type { TicketFolioFormOutput } from "../schemas/UpdateTicketFolioDepartment.schema";
import { DetailsTicketFolio } from "../components/DetailsTicketFolio";

export const EditTicketFolioDepartmentPage = () => {
    const { departmentId } = useParams();
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/folios/tickets');

    const { data: ticketFolio, isLoading, isError } = useGetTicketFolioByIdDepartment(departmentId);
    const { mutate, isPending, isSuccess } = useEditTicketFolioDepartment();

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
        if (!departmentId) return;

        mutate({ departmentId, editTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('folios.tickets.edit_page.success.title'),
                    description: t('folios.tickets.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/folios/tickets/${departmentId}`);
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
        navigateSmartBack(`/folios/tickets/${departmentId}`);
    };

    if (isLoading || !ticketFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.tickets.edit_page.title')}
                description={t('folios.tickets.edit_page.description')}
                backLink={"/folios/tickets"}
            >
                <></>
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            title={t('folios.tickets.edit_page.title')}
            description={t('folios.tickets.edit_page.description')}
            backLink={"/folios/tickets"}
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
