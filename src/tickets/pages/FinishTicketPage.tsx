import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useFinishTicket } from "../hooks/useFinishTicket";
import type { FinishTicketFormOutput } from "../shcemas/finish-ticket.schema";
import { FinishTicketForm } from "../components/forms/FinishTicketForm";

export const FinishTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutate, isPending } = useFinishTicket();

    const handleSubmit = (values: FinishTicketFormOutput) => {
        if (!id) {
            return
        }

        mutate({ ticketId: id, finishTicketPayload: values }, {
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
                title={t('tickets.form.finish.header.title')}
                description={t('tickets.form.finish.header.description')}
            />

            <div>
                <FinishTicketForm
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
