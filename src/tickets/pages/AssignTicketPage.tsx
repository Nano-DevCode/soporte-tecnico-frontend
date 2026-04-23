import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useGetTicketById } from "../hooks/useGetTicketById";
import { useAssignTicket } from "../hooks/useAssignTicket";
import { useEffect } from "react";
import { sileo } from "sileo";
import type { AssignTicketFormOutput } from "../shcemas/assign-ticket.schema";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { AssignTicketForm } from "../components/forms/AssignTicketForm";
import { DetailsTicket } from "../components/details/DetailsTicket";

export const AssignTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { isLoading, isError, data: ticket } = useGetTicketById(id);
    const { mutate, isPending } = useAssignTicket();

    useEffect(() => {
        if (!isLoading && (isError || !ticket)) {
            sileo.error({
                title: 'p',
                description: 'p',
                duration: 6000,
            });

            navigate('/tickets', { replace: true });
        }
    }, [isError, isLoading, ticket, id, navigate, t]);

    const handleSubmit = (values: AssignTicketFormOutput) => {
        if (!id) {
            return
        }

        mutate({ ticketId: id, assignTicketPayload: values }, {
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

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!ticket) {
        return null;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink="/tickets"
                title={t('tickets.form.assign.header.title')}
                description={t('tickets.form.assign.header.description')}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <DetailsTicket ticket={ticket} />
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                    <AssignTicketForm
                        isPending={isPending}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>

            </div>

        </div>
    )
}
