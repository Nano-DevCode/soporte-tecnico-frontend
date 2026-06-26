import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useEffect } from "react";
import { sileo } from "sileo";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { getAvailableActions, TicketActions } from "../utils/ticket-state-machine";
import { useEditTicket } from "../hooks/useEditTicket";
import { useGetTicketById } from "../hooks/useGetTicketById";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { TicketFormOutput } from "../schemas/ticket.schema";
import { CreateTicketForm } from "../components/forms/CreateTicketForm";
import { RejectionReportDetails } from "../components/details/RejectionReportDetails";
import { TicketFormSkeleton } from "../components/Skeletons/TicketFormSkeleton";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";


export const EditTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { data: issueTypes, isLoading: isLoadingIssues, isError: isErrorIssue } = useAllIssueTypes();
    const { data: ticket, isLoading: isLoadingTicket, isError: isErrorTicket } = useGetTicketById(id);
    const { mutate, isPending, isSuccess } = useEditTicket();

    const isLoading = isLoadingIssues || isLoadingTicket;

    useEffect(() => {
        if (isLoading) return;

        if (isErrorTicket || !ticket) {
            sileo.error({
                title: t('tickets.not_found.title'),
                description: t('tickets.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
            return;
        }

        if (isErrorIssue || !issueTypes) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isLoading, isErrorTicket, ticket, isErrorIssue, issueTypes, t, navigateFallback]);

    const handleSubmit = (values: TicketFormOutput) => {
        if (!id) return;

        mutate({ id, editTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.edit_page.success.title'),
                    description: t('tickets.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
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
        navigateSmartBack(`/tickets/${id}`);
    };

    if (isLoading || !ticket || !issueTypes) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('tickets.edit_page.title')}
                description={t('tickets.edit_page.description')}
            >
                <TicketFormSkeleton />
            </CustomFormPageLayout>
        );
    }

    const canWatchRejectionReport =
        getAvailableActions(ticket.currentStatusCode).includes(TicketActions.WATCH_REJECTION_REPORT);

    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('tickets.edit_page.title')}
            description={t('tickets.edit_page.description')}
        >
            {canWatchRejectionReport && (
                <RejectionReportDetails ticketId={ticket.id} />
            )}
            <CreateTicketForm
                ticket={ticket}
                isPending={isPending || isSuccess}
                titleButton={t('common.buttons.save_changes')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                issueTypes={issueTypes}
            />
        </CustomFormPageLayout>
    );
}
