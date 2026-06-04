import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";
import { useEffect } from "react";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useFinishTicket } from "../hooks/useFinishTicket";
import { useGetMaintenanceTypes } from "@/common/maintenance-type/hooks/useGetMaintenanceTypes";
import { useGetServiceTypes } from "@/common/service-types/hooks/useGetServiceTypes";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { FinishTicketFormOutput } from "../schemas/finish-ticket.schema";
import { FinishTicketForm } from "../components/forms/FinishTicketForm";
import { FinishTicketFormSkeleton } from "../components/Skeletons/FinishTicketFormSkeleton";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { TechnicalReportsAccordion } from "../components/details/TechnicalReportsAccordion";
import { TechnicalReportsAccordionSkeleton } from "../components/Skeletons/TechnicalReportsAccordionSkeleton";

export const FinishTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { data: maintenanceTypes, isLoading: isMaintenanceLoading, isError: isMaintenanceError } = useGetMaintenanceTypes();
    const { data: serviceTypes, isLoading: isServiceLoading, isError: isServiceError } = useGetServiceTypes();
    const { mutate, isPending, isSuccess } = useFinishTicket();

    const isLoading = isMaintenanceLoading || isServiceLoading;
    const isError = isMaintenanceError || isServiceError;


    useEffect(() => {
        if (isLoading) return;

        if (isError || !maintenanceTypes || !serviceTypes) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, maintenanceTypes, navigateFallback, serviceTypes, t]);


    const handleSubmit = (values: FinishTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, finishTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.finish_page.success.title'),
                    description: t('tickets.finish_page.success.message'),
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

    if (isLoading || !maintenanceTypes || !serviceTypes || !id) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('tickets.finish_page.title')}
                description={t('tickets.finish_page.description')}
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
            title={t('tickets.finish_page.title')}
            description={t('tickets.finish_page.description')}
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
                    />
                </div>

            </div>

        </CustomFormPageLayout>
    )
}
