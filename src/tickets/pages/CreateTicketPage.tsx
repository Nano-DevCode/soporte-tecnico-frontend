import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { sileo } from "sileo";
import { useCreateTicket } from "../hooks/useCreateTicket";
import type { TicketFormOutput } from "../shcemas/ticket.schema";
import { CreateTicketForm } from "../components/forms/CreateTicketForm";


export const CreateTicketPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutate, isPending } = useCreateTicket();

    const handleSubmit = (values: TicketFormOutput) => {
        mutate(values, {
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
                title={t('tickets.create_page.title')}
                description={t('tickets.create_page.description')}
            />
            <CreateTicketForm
                isPending={isPending}
                titleButton={t('common.buttons.create')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}
