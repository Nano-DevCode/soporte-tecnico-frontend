import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { sileo } from "sileo";
import type { TicketFormOutput } from "../shcemas/ticket.schema";
import { CreateTicketForm } from "../components/forms/CreateTicketForm";
import { useEditTicket } from "../hooks/useEditTicket";
import { useGetTicketById } from "../hooks/useGetTicketById";
import { useEffect } from "react";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { RejectionReportDetails } from "../components/details/RejectionReportDetails";
import { getAvailableActions, TicketEvent } from "../utils/ticket-state-machine";


export const EditTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { isLoading, isError, data: ticket } = useGetTicketById(id);

    const { mutate, isPending } = useEditTicket();

    const previousPage = location.state?.from;

    useEffect(() => {
        if (!isLoading && (isError || !ticket)) {
            sileo.error({
                title: t('tickets.not_found.title'),
                description: t('tickets.not_found.message'),
                duration: 6000,
            });
            navigate(previousPage || `/tickets`, { replace: true });
        }
    }, [isError, isLoading, ticket, navigate, t, previousPage]);

    const handleSubmit = (values: TicketFormOutput) => {
        if (!id) return;

        mutate({ id, editTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.edit_page.success.title'),
                    description: t('tickets.edit_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || `/tickets`, { replace: true });
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.edit_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate(previousPage || `/tickets`);
    };

    if (isLoading) return <CustomFullScreenLoading />;
    if (!ticket) return null;

    const canWatchRejectionReport =
        getAvailableActions(ticket.currentStatusCode).includes(TicketEvent.WATCH_REJECTION_REPORT);

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || `/tickets/${ticket.id}`}
                title={t('tickets.edit_page.title')}
                description={t('tickets.edit_page.description')}
            />
            {canWatchRejectionReport && (
                <RejectionReportDetails ticketId={ticket.id} />
            )}
            <CreateTicketForm
                ticket={ticket}
                isPending={isPending}
                titleButton={t('common.buttons.save_changes')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
}
