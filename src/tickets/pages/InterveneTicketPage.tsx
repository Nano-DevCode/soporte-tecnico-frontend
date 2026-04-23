import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
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

    const { mutate, isPending } = useInterveneTicket();

    const handleSubmit = (values: InterveneTicketFormOutput) => {
        if (!id) {
            return
        }

        mutate({ ticketId: id, interveneTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.create_page.success.title'),
                    description: t('tickets.create_page.success.message'),
                    duration: 5000,
                });
                navigate(`/tickets`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                const errorMessage = getAxiosErrorMessage(error);

                sileo.error({
                    title: t('tickets.create_page.error.title'),
                    description: errorMessage,
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate('/tickets');
    };

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink="/tickets"
                title={t('tickets.form.intervene.header.title')}
                description={t('tickets.form.intervene.header.description')}
            />
            {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"> */}
            {/* <div className="lg:col-span-7 order-2 lg:order-1">
                    <DetailsTicket ticket={ticket} />
                </div> */}

            <div>
                <InterveneTicketForm
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>

            {/* </div> */}

        </div>
    )
}
