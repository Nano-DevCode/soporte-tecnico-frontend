import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useInterveneTicket } from "../hooks/useInterveneTicket";
import type { InterveneTicketFormOutput } from "../shcemas/intervene-ticket.schema";
import { InterveneTicketForm } from "../components/forms/InterveneTicketForm";

export const InterveneTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { mutate, isPending } = useInterveneTicket();

    const previousPage = location.state?.from;

    const handleSubmit = (values: InterveneTicketFormOutput) => {
        if (!id) {
            return
        }

        mutate({ ticketId: id, interveneTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.intervene_page.success.title'),
                    description: t('tickets.intervene_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || '/tickets', { replace: true })
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                const errorMessage = getAxiosErrorMessage(error);

                sileo.error({
                    title: t('tickets.intervene_page.error.title'),
                    description: errorMessage,
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate(previousPage || '/tickets')
    };

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || "/tickets"}
                title={t('tickets.intervene_page.title')}
                description={t('tickets.intervene_page.description')}
            />

            <div>
                <InterveneTicketForm
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
