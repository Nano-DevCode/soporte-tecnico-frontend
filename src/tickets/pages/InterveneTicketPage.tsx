import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { useInterveneTicket } from "../hooks/useInterveneTicket";
import type { InterveneTicketFormOutput } from "../schemas/intervene-ticket.schema";
import { InterveneTicketForm } from "../components/forms/InterveneTicketForm";
import { useGetTags } from "@/common/tags/hooks/useGetTags";
import { useEffect } from "react";

export const InterveneTicketPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const previousPage = location.state?.from;

    const { mutate, isPending } = useInterveneTicket();
    const { data: tags, isLoading, isError } = useGetTags();

    useEffect(() => {
        if (isLoading) return

        if (isError || !tags) {
            sileo.error({
                title: t('common.fetch_error.title'),
                description: t('common.fetch_error.description'),
                duration: 6000,
            });
            navigate(previousPage || `/tickets`, { replace: true });
        }
    }, [isError, isLoading, tags, navigate, t, previousPage]);


    const handleSubmit = (values: InterveneTicketFormOutput) => {
        if (!id) return

        mutate({ ticketId: id, interveneTicketPayload: values }, {
            onSuccess: () => {
                sileo.success({
                    title: t('tickets.intervene_page.success.title'),
                    description: t('tickets.intervene_page.success.message'),
                    duration: 5000,
                });
                navigate(previousPage || '/tickets', { replace: true })
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
        navigate(previousPage || `/tickets`);
    };

    if (isLoading || !tags) {
        return (
            <div className="mx-auto max-w-4xl space-y-5">
                <CustomTitlePageWithBack
                    backLink={previousPage || "/tickets"}
                    title={t('tickets.intervene_page.title')}
                    description={t('tickets.intervene_page.description')}
                />
                {/* <FinishTicketFormSkeleton /> */}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <CustomTitlePageWithBack
                backLink={previousPage || "/tickets"}
                title={t('tickets.intervene_page.title')}
                description={t('tickets.intervene_page.description')}
            />

            <div>
                <InterveneTicketForm
                    tags={tags}
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
