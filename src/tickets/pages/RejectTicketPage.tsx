import { useLocation, useNavigate, useParams } from "react-router";
import { DetailsTicket } from "../components/details/DetailsTicket"
import { useGetTicketById } from "../hooks/useGetTicketById"
import { useTranslation } from "react-i18next";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { sileo } from "sileo";
import { useEffect } from "react";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { useRejectTicket } from "../hooks/useRejectTicket";
import type { RejectTicketFormOutput } from "../shcemas/reject-ticket.schema";
import { RejectTicketForm } from "../components/forms/RejectTicketForm";

export const RejectTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { isLoading, isError, data: ticket } = useGetTicketById(id);
    const { mutate, isPending } = useRejectTicket();

    const previousPage = location.state?.from;

    useEffect(() => {
        if (!isLoading && (isError || !ticket)) {
            sileo.error({
                title: t('tickets.not_found.title'),
                description: t('tickets.not_found.message'),
                duration: 6000,
            });

            navigate(previousPage || `/tickets`, { replace: true });
        }
    }, [isError, isLoading, ticket, id, navigate, t, previousPage]);

    const handleSubmit = (values: RejectTicketFormOutput) => {
        if (!id) {
            return
        }

        mutate({ ticketId: id, rejectTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.reject_page.success.title'),
                    description: t('tickets.reject_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || `/tickets`, { replace: true });
            },
            onError: (error) => {
                console.error("Error en la mutación:", error);

                const errorMessage = getAxiosErrorMessage(error);

                sileo.error({
                    title: t('tickets.reject_page.error.title'),
                    description: errorMessage,
                    duration: 7000,
                });
            },
        });
    };

    const handleCancel = () => {
        navigate(previousPage || `/tickets`);
    };

    if (isLoading) return <CustomFullScreenLoading />;

    if (!ticket) return null;

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || '/tickets'}
                title={t('tickets.reject_page.title')}
                description={t('tickets.reject_page.description')}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <DetailsTicket ticket={ticket} />
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-15">
                    <RejectTicketForm
                        isPending={isPending}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>

            </div>
        </div>
    )
}

