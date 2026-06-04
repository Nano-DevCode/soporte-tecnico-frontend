import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useInterveneTicket } from "../hooks/useInterveneTicket";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { InterveneTicketFormOutput } from "../schemas/intervene-ticket.schema";
import { InterveneTicketForm } from "../components/forms/InterveneTicketForm";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";

export const InterveneTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateSmartBack } = useSmartNavigation('/tickets');


    const { mutate, isPending, isSuccess } = useInterveneTicket();


    const handleSubmit = (values: InterveneTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, interveneTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.intervene_page.success.title'),
                    description: t('tickets.intervene_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.intervene_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/tickets/${id}`);
    };

    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('tickets.intervene_page.title')}
            description={t('tickets.intervene_page.description')}
        >
            <InterveneTicketForm
                isPending={isPending || isSuccess}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </CustomFormPageLayout>
    )
}
