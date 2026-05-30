import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { sileo } from "sileo";
import { useCreateTicket } from "../hooks/useCreateTicket";
import type { TicketFormOutput } from "../schemas/ticket.schema";
import { CreateTicketForm } from "../components/forms/CreateTicketForm";
import { useEffect } from "react";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { TicketFormSkeleton } from "../components/Skeletons/TicketFormSkeleton";


export const CreateTicketPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const previousPage = location.state?.from;

    const { mutate, isPending, isSuccess } = useCreateTicket();

    const { data: issueTypes, isLoading, isError } = useAllIssueTypes();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !issueTypes) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });

            navigate(previousPage || `/tickets`, { replace: true });
        }
    }, [isError, isLoading, issueTypes, navigate, previousPage, t]);

    const handleSubmit = (values: TicketFormOutput) => {
        mutate(values, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.create_page.success.title'),
                    description: t('tickets.create_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || `/tickets`, { replace: true });
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                sileo.error({
                    title: t('tickets.create_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate(previousPage || `/tickets`);
    };

    if (isLoading || !issueTypes) {
        return (<div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || `/tickets`}
                title={t('tickets.create_page.title')}
                description={t('tickets.create_page.description')}
            />
            <TicketFormSkeleton />
        </div>)
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || `/tickets`}
                title={t('tickets.create_page.title')}
                description={t('tickets.create_page.description')}
            />
            <CreateTicketForm
                isPending={isPending || isSuccess}
                titleButton={t('common.buttons.create')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                issueTypes={issueTypes}
            />
        </div>
    );
}
