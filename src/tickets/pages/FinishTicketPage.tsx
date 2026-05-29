import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useFinishTicket } from "../hooks/useFinishTicket";
import type { FinishTicketFormOutput } from "../schemas/finish-ticket.schema";
import { FinishTicketForm } from "../components/forms/FinishTicketForm";
import { useGetMaintenanceTypes } from "@/common/maintenance-type/hooks/useGetMaintenanceTypes";
import { useGetServiceTypes } from "@/common/service-types/hooks/useGetServiceTypes";
import { useEffect } from "react";
import { FinishTicketFormSkeleton } from "../components/Skeletons/FinishTicketFormSkeleton";

export const FinishTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const previousPage = location.state?.from;

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
            navigate(previousPage || `/tickets`, { replace: true });
        }
    }, [isError, isLoading, maintenanceTypes, navigate, previousPage, serviceTypes, t]);


    const handleSubmit = (values: FinishTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, finishTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.finish_page.success.title'),
                    description: t('tickets.finish_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || `/tickets`, { replace: true });
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
        navigate(previousPage || `/tickets`);
    };

    if (isLoading || !maintenanceTypes || !serviceTypes) {
        return (
            <div className="mx-auto max-w-4xl space-y-5">
                <CustomTitlePageWithBack
                    backLink={previousPage || `/tickets`}
                    title={t('tickets.finish_page.title')}
                    description={t('tickets.finish_page.description')}
                />
                <FinishTicketFormSkeleton />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || `/tickets`}
                title={t('tickets.finish_page.title')}
                description={t('tickets.finish_page.description')}
            />

            <FinishTicketForm
                maintenanceTypes={maintenanceTypes}
                serviceTypes={serviceTypes}
                isPending={isPending || isSuccess}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    )
}
