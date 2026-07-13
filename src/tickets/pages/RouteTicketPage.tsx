import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";
import { useEffect } from "react";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useGetTicketById } from "../hooks/useGetTicketById"
import { useRouteTicket } from "../hooks/useRouteTicket";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { RouteTicketFormOutput } from "../schemas/route-ticket.schema";
import { DetailsTicket } from "../components/details/DetailsTicket"
import { RouteTicketForm } from "../components/forms/RouteTicketForm";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { useGetCoordinators } from "@/common/coordinators/hooks/useGetCoordinators";
import { RouteTicketFormSkeleton } from "../components/Skeletons/RouteTicketFormSkeleton";
import { DetailsTicketSkeleton } from "../components/Skeletons/DetailsTicketSkeleton";

export const RouteTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateFallback, navigateSmartBack } = useSmartNavigation('/tickets');

    const { isLoading: isLoadingTicket, isError: isErrorTicket, data: ticket, error } = useGetTicketById(id);
    const { isLoading: isLoadingCoordinators, isError: isErrorCoordinator, data: coordinators } = useGetCoordinators();
    const { mutate, isPending, isSuccess } = useRouteTicket();

    const isLoading = isLoadingCoordinators || isLoadingTicket;

    useEffect(() => {
        if (isLoading) return;

        if (isErrorTicket || !ticket) {
            sileo.error({
                title: t('common.errors.title'),
                description: getAxiosErrorMessage(error),
                duration: 6000,
            });
            navigateFallback();
            return;
        }

        if (isErrorCoordinator || !coordinators) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isLoading, ticket, t, navigateFallback, isErrorTicket, isErrorCoordinator, coordinators, error]);

    const handleSubmit = (values: RouteTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, routeTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.route_page.success.title'),
                    description: t('tickets.route_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.route_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/tickets/${id}`);
    };

    if (isLoading || !ticket || !coordinators) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('tickets.route_page.title')}
                description={t('tickets.route_page.description')}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <DetailsTicketSkeleton />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                        <RouteTicketFormSkeleton />
                    </div>

                </div>
            </CustomFormPageLayout>
        )
    }

    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('tickets.route_page.title')}
            description={t('tickets.route_page.description')}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <DetailsTicket ticket={ticket} />
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                    <RouteTicketForm
                        priorityDefault={ticket.priority}
                        isPending={isPending || isSuccess}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        coordinators={coordinators} />
                </div>

            </div>
        </CustomFormPageLayout>
    )
}

