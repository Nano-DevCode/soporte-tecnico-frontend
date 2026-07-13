import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { sileo } from "sileo";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { TicketFormOutput } from "../schemas/ticket.schema";
import { CreateTicketForm } from "../components/forms/CreateTicketForm";
import { TicketFormSkeleton } from "../components/Skeletons/TicketFormSkeleton";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { isAxiosError } from "axios";


export const CreateTicketPage = () => {
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { mutateAsync, isPending, isSuccess } = useCreateTicket();

    const { data: issueTypes, isLoading, isError } = useAllIssueTypes();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !issueTypes) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, issueTypes, navigateFallback, t]);

    const handleSubmit = async (values: TicketFormOutput, idempotencyKey: string) => {
        try {
            await mutateAsync({ data: values, idempotencyKey });

            sileo.success({
                title: t('tickets.create_page.success.title'),
                description: t('tickets.create_page.success.message'),
                duration: 5000,
            });

            navigateSmartBack();

        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 429) {
                return;
            }
            console.error("Error en la mutación:", error);
            sileo.error({
                title: t('tickets.create_page.error.title'),
                description: getAxiosErrorMessage(error as Error),
                duration: 7000,
            });
        }
    };

    const handleCancel = () => {
        navigateSmartBack();
    };

    if (isLoading || !issueTypes) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets`}
                title={t('tickets.create_page.title')}
                description={t('tickets.create_page.description')}
            >
                <TicketFormSkeleton />
            </CustomFormPageLayout>
        )
    }

    return (
        <CustomFormPageLayout
            backLink={`/tickets`}
            title={t('tickets.create_page.title')}
            description={t('tickets.create_page.description')}
        >
            <CreateTicketForm
                isPending={isPending || isSuccess}
                titleButton={t('common.buttons.create')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                issueTypes={issueTypes}
            />
        </CustomFormPageLayout>
    );
}
