import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { sileo } from "sileo";

import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useInterveneTicket } from "../hooks/useInterveneTicket";
import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";

import type { InterveneTicketFormOutput } from "../schemas/intervene-ticket.schema";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { useGetFaultValidities } from "@/common/fault-validities/hooks/useGetFaultValidities";
import { useEffect } from "react";
import { InterveneTicketFormSkeleton } from "../components/Skeletons/InterveneTicketFormSkeleton";
import { useGetTicketById } from "../hooks/useGetTicketById";
import { InterveneTicketForm } from "../components/forms/InterveneTicketForm";

export const InterveneTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { navigateSmartBack, navigateFallback } = useSmartNavigation('/tickets');

    const { data: faultValidities, isLoading: isLoadingFault, isError: isFaultError } = useGetFaultValidities()
    const { data: ticket, isLoading: isLoadingTicket, isError: isTicketError, error } = useGetTicketById(id);
    const { mutate, isPending, isSuccess } = useInterveneTicket();

    const isLoading = isLoadingFault || isLoadingTicket;
    const isError = isFaultError || isTicketError;


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

        if (isError || !faultValidities) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [error, faultValidities, isError, isLoading, isTicketError, navigateFallback, t, ticket]);

    const handleSubmit = (values: InterveneTicketFormOutput) => {
        if (!id) return

        mutate({
            ticketId: id, interveneTicketPayload: {
                ...values,
                equipment_ids: values.equipment_ids.map(eq => String(eq.id)),
                materials_used: values.materials_used || undefined
            }
        }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.intervene_page.success.title'),
                    description: t('tickets.intervene_page.success.message'),
                    duration: 5000,
                });
                navigateSmartBack(`/tickets/${id}`);
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);
                sileo.error({
                    title: t('tickets.intervene_page.error.title'),
                    description: getAxiosErrorMessage(error),
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigateSmartBack(`/tickets/${id}`);
    };

    if (isLoading || !faultValidities || !ticket || !id) {
        return (
            <CustomFormPageLayout
                backLink={`/tickets/${id}`}
                title={t('tickets.intervene_page.title')}
                description={t('tickets.intervene_page.description')}
            >
                <InterveneTicketFormSkeleton />
            </CustomFormPageLayout>
        )
    }

    return (
        <CustomFormPageLayout
            backLink={`/tickets/${id}`}
            title={t('tickets.intervene_page.title')}
            description={t('tickets.intervene_page.description')}
        >
            <InterveneTicketForm
                ticketTags={ticket.tags}
                isPending={isPending || isSuccess}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                faultValidities={faultValidities}
            />
        </CustomFormPageLayout>
    )
}
