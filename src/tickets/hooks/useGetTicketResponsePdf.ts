import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";
import { getTicketResponsePdfAction } from "../actions/get-ticket-response-pdf";
import { useState } from "react";
import { sileo } from "sileo";
import { useTranslation } from "react-i18next";

export const useGetTicketResponsePdf = () => {
    const { t } = useTranslation();
    const [isPending, setIsPending] = useState(false);

    // Mantenemos los mismos argumentos que requiere tu action
    const mutate = async (...args: Parameters<typeof getTicketResponsePdfAction>) => {
        setIsPending(true);
        try {
            const blob = await getTicketResponsePdfAction(...args);

            const fileUrl = window.URL.createObjectURL(
                new Blob([blob], { type: 'application/pdf' })
            );
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 1000);
        } catch (error) {
            console.error("Error al obtener el PDF", error);
            sileo.error({
                title: t('tickets.documents.errors.title'),
                description: getAxiosErrorMessage(error as Error) || t('tickets.documents.errors.loading_response'),
            });
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, mutateAsync: mutate, isPending };
};