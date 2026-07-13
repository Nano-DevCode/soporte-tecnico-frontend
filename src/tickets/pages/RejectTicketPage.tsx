import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";
import { useEffect } from "react";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useGetTicketById } from "../hooks/useGetTicketById"
import { useRejectTicket } from "../hooks/useRejectTicket";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { RejectTicketFormOutput } from "../schemas/reject-ticket.schema";
import { RejectTicketForm } from "../components/forms/RejectTicketForm";
import { DetailsTicket } from "../components/details/DetailsTicket"
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsTicketSkeleton } from "../components/Skeletons/DetailsTicketSkeleton";
import { RejectTicketFormSkeleton } from "../components/Skeletons/RejectTicketFormSkeleton";

export const RejectTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { isLoading, isError, data: ticket, error } = useGetTicketById(id);
    const { mutate, isPending, isSuccess } = useRejectTicket();


    useEffect(() => {
        if (isLoading) return;

        if (isError || !ticket) {
            sileo.error({
                title: t('common.errors.title'),
                description: getAxiosErrorMessage(error),
                duration: 6000,
            });

            navigateFallback();
        }
    }, [isError, isLoading, ticket, id, t, navigateFallback, error]);

    const handleSubmit = (values: RejectTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, rejectTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.reject_page.success.title'),
                    description: t('tickets.reject_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.reject_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/tickets/${id}`);
    };

    if (isLoading || !ticket) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('tickets.reject_page.title')}
                description={t('tickets.reject_page.description')}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <DetailsTicketSkeleton />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                        <RejectTicketFormSkeleton />
                    </div>

                </div>
            </CustomFormPageLayout>
        );
    }
    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('tickets.reject_page.title')}
            description={t('tickets.reject_page.description')}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <DetailsTicket ticket={ticket} />
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                    <RejectTicketForm
                        isPending={isPending || isSuccess}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>

            </div>
        </CustomFormPageLayout>
    )
}

