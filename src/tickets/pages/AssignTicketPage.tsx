import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useEffect } from "react";
import { sileo } from "sileo";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useGetTicketById } from "../hooks/useGetTicketById";
import { useAssignTicket } from "../hooks/useAssignTicket";
import { useGetTechnicians } from "@/common/technicians/hooks/useGetTechnicians";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { AssignTicketFormOutput } from "../schemas/assign-ticket.schema";
import { AssignTicketForm } from "../components/forms/AssignTicketForm";
import { DetailsTicket } from "../components/details/DetailsTicket";
import { DetailsTicketSkeleton } from "../components/Skeletons/DetailsTicketSkeleton";
import { AssignTicketFormSkeleton } from "../components/Skeletons/AssignTicketFormSkeleton";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";

export const AssignTicketPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();

    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const {
        isLoading: loadingTicket,
        isError: isTicketError,
        data: ticket,
        error
    } = useGetTicketById(id);

    const {
        isLoading: loadingTechs,
        isError: isTechsError,
        data: technicians,
    } = useGetTechnicians();

    const { mutate, isPending, isSuccess } = useAssignTicket();

    const isLoading = loadingTicket || loadingTechs;

    useEffect(() => {
        if (isLoading) return;

        if (isTicketError || !ticket) {
            sileo.error({
                title: t('common.errors.title'),
                description: getAxiosErrorMessage(error),
                duration: 6000,
            });
            navigateFallback();
            return;
        }

        if (isTechsError || !technicians) {
            sileo.error({
                title: t('tickets.assign_page.fetch_error.title'),
                description: t('tickets.assign_page.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [t, isLoading, ticket, isTicketError, isTechsError, technicians, navigateFallback, error]);

    const handleSubmit = (values: AssignTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, assignTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.assign_page.success.title'),
                    description: t('tickets.assign_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.assign_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/tickets/${id}`);
    };

    if (isLoading || !ticket || !technicians) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('tickets.assign_page.title')}
                description={t('tickets.assign_page.description')}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <DetailsTicketSkeleton />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                        <AssignTicketFormSkeleton />
                    </div>

                </div>
            </CustomFormPageLayout>
        )
    }

    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('tickets.assign_page.title')}
            description={t('tickets.assign_page.description')}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <DetailsTicket ticket={ticket} />
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                    <AssignTicketForm
                        ticket={ticket}
                        technicians={technicians}
                        isPending={isPending || isSuccess}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>

            </div>
        </CustomFormPageLayout>
    )
}
