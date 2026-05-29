import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { useGetTicketById } from "../hooks/useGetTicketById";
import { useAssignTicket } from "../hooks/useAssignTicket";
import { useEffect } from "react";
import { sileo } from "sileo";
import type { AssignTicketFormOutput } from "../schemas/assign-ticket.schema";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { AssignTicketForm } from "../components/forms/AssignTicketForm";
import { DetailsTicket } from "../components/details/DetailsTicket";
import { DetailsTicketSkeleton } from "../components/Skeletons/DetailsTicketSkeleton";
import { AssignTicketFormSkeleton } from "../components/Skeletons/AssignTicketFormSkeleton";
import { useGetTechnicians } from "@/common/technicians/hooks/useGetTechnicians";

export const AssignTicketPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const previousPage = location.state?.from;

    const {
        isLoading: loadingTicket,
        isError: isTicketError,
        data: ticket
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
                title: t('tickets.not_found.title'),
                description: t('tickets.not_found.message'),
                duration: 6000,
            });
            navigate(previousPage || `/tickets`, { replace: true });
            return;
        }

        if (isTechsError || !technicians) {
            sileo.error({
                title: t('tickets.assign_page.fetch_error.title'),
                description: t('tickets.assign_page.fetch_error.description'),
                duration: 6000,
            });
            navigate(previousPage || `/tickets`, { replace: true });
        }
    }, [isLoading, ticket, id, navigate, t, isTicketError, isTechsError, previousPage, technicians]);

    const handleSubmit = (values: AssignTicketFormOutput) => {
        if (!id) {
            return
        }
        mutate({ ticketId: id, assignTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.assign_page.success.title'),
                    description: t('tickets.assign_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || `/tickets`, { replace: true });
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                const errorMessage = getAxiosErrorMessage(error);

                sileo.error({
                    title: t('tickets.assign_page.error.title'),
                    description: errorMessage,
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate(previousPage || `/tickets`);
    };

    if (isLoading || !ticket || !technicians) {
        return (
            <div className="mx-auto space-y-5">
                <CustomTitlePageWithBack
                    backLink={previousPage || `/tickets/${id}`}
                    title={t('tickets.assign_page.title')}
                    description={t('tickets.assign_page.description')}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <DetailsTicketSkeleton />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                        <AssignTicketFormSkeleton />
                    </div>

                </div>

            </div>
        )
    }

    return (
        <div className="mx-auto space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || `/tickets/${id}`}
                title={t('tickets.assign_page.title')}
                description={t('tickets.assign_page.description')}
            />
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

        </div>
    )
}
