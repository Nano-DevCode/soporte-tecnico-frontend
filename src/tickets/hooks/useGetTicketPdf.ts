import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { getTicketPdfAction } from "../actions/get-ticket-pdf.action";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { sileo } from "sileo";

export const useGetTicketPdf = () => {
    const { t } = useTranslation();
    const [isPending, setIsPending] = useState(false);

    const mutate = async (...args: Parameters<typeof getTicketPdfAction>) => {
        setIsPending(true);

        try {
            const blob = await getTicketPdfAction(...args);

            const fileUrl = window.URL.createObjectURL(
                new Blob([blob], { type: 'application/pdf' })
            );
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';
            // link.download = `solicitud.pdf`; 

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
        } catch (error) {
            console.error("Error al obtener el PDF", error);
            sileo.error({
                title: t('tickets.documents.errors.title'),
                description: getAxiosErrorMessage(error as Error) || t('tickets.documents.errors.loading_request'),
            });

        } finally {
            setIsPending(false);
        }
    };
    return { mutate, mutateAsync: mutate, isPending };
};