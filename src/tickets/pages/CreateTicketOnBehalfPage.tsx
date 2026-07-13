import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useCreateTicketOnBehalf } from "../hooks/useCreateTicketOnBehalf";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { useEffect } from "react";
import { sileo } from "sileo";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import type { TicketOnBehalfFormOutput } from "../schemas/ticket-on-behalf.schema";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { CreateTicketOnBehalfForm } from "../components/forms/CreateTicketOnBehalfForm";
import { useGetDepartmentManagers } from "@/common/department-managers/hooks/useGetDepartmentManagers";
import { TicketOnBehalfFormSkeleton } from "../components/Skeletons/TickeOnBehalfFormSkeleton";
import { isAxiosError } from "axios";

export const CreateTicketOnBehalfPage = () => {
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { mutateAsync, isPending, isSuccess } = useCreateTicketOnBehalf();

    const { data: issueTypes, isLoading: isIssueLoading, isError: isIssueError } = useAllIssueTypes();
    const { data: managers, isLoading: isManagersLoading, isError: isManagersError } = useGetDepartmentManagers();

    const isLoading = isIssueLoading || isManagersLoading;
    const isError = isIssueError || isManagersError;

    useEffect(() => {
        if (isLoading) return;

        if (isError || !issueTypes || !managers) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, issueTypes, managers, navigateFallback, t]);

    const handleSubmit = async (values: TicketOnBehalfFormOutput, idempotencyKey: string) => {
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

    if (isLoading || !issueTypes || !managers) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets`}
                title={t('tickets.create_on_behalf_page.title')}
                description={t('tickets.create_on_behalf_page.description')}
            >
                <TicketOnBehalfFormSkeleton />
            </CustomFormPageLayout>
        )
    }

    return (
        <CustomFormPageLayout
            backLink={`/tickets`}
            title={t('tickets.create_on_behalf_page.title')}
            description={t('tickets.create_on_behalf_page.description')}
        >
            <CreateTicketOnBehalfForm
                departmentManagers={managers}
                isPending={isPending || isSuccess}
                titleButton={t('common.buttons.create')}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                issueTypes={issueTypes}
            />
        </CustomFormPageLayout>
    );
}
