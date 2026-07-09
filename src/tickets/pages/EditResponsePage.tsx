import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";
import { useEffect } from "react";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useGetMaintenanceTypes } from "@/common/maintenance-type/hooks/useGetMaintenanceTypes";
import { useGetServiceTypes } from "@/common/service-types/hooks/useGetServiceTypes";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { FinishTicketFormOutput } from "../schemas/finish-ticket.schema";
import { FinishTicketForm } from "../components/forms/FinishTicketForm";
import { FinishTicketFormSkeleton } from "../components/Skeletons/FinishTicketFormSkeleton";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { TechnicalReportsAccordion } from "../../technical-reports/components/TechnicalReportsAccordion";
import { TechnicalReportsAccordionSkeleton } from "../../technical-reports/components/skeletons/TechnicalReportsAccordionSkeleton";
import { useGetResponseByTicketId } from "@/responses/hooks/useGetResponseByTicketId";
import { useUpdateResponseByTicket } from "@/responses/hooks/useUpdateResponseByTicket";

export const EditResponsePage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { data: maintenanceTypes, isLoading: isMaintenanceLoading, isError: isMaintenanceError } = useGetMaintenanceTypes();
    const { data: serviceTypes, isLoading: isServiceLoading, isError: isServiceError } = useGetServiceTypes();
    const { data: response, isLoading: isLoadingResponse, isError: isErrorResponse } = useGetResponseByTicketId(id);
    const { mutate, isPending, isSuccess } = useUpdateResponseByTicket();

    const isLoading = isMaintenanceLoading || isServiceLoading || isLoadingResponse;
    const isError = isMaintenanceError || isServiceError || isErrorResponse;


    useEffect(() => {
        if (isLoading) return;

        if (isError || !response) {
            sileo.error({
                title: t('responses.not_found.title'),
                description: t('responses.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
            return
        }

        if (isError || !maintenanceTypes || !serviceTypes) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, maintenanceTypes, navigateFallback, response, serviceTypes, t]);


    const handleSubmit = (values: FinishTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, updateData: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('responses.edit_page.success.title'),
                    description: t('responses.edit_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.finish_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/tickets/${id}`);
    };

    if (isLoading || !maintenanceTypes || !serviceTypes || !response || !id) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('responses.edit_page.title')}
                description={t('responses.edit_page.description')}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <TechnicalReportsAccordionSkeleton />
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-15">
                        <FinishTicketFormSkeleton />
                    </div>

                </div>
            </CustomFormPageLayout>
        );
    }

    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('responses.edit_page.title')}
            description={t('responses.edit_page.description')}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-5 order-2 lg:order-1">
                    <TechnicalReportsAccordion ticketId={id} />
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-15">
                    <FinishTicketForm
                        maintenanceTypes={maintenanceTypes}
                        serviceTypes={serviceTypes}
                        isPending={isPending || isSuccess}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        response={response}
                    />
                </div>

            </div>

        </CustomFormPageLayout>
    )
}
