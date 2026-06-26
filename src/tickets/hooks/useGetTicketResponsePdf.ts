import { getTicketResponsePdfAction } from "../actions/get-ticket-response-pdf";
import { useState } from "react";

export const useGetTicketResponsePdf = () => {
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
        } finally {
            setIsPending(false);
        }
    };

    return { mutate, mutateAsync: mutate, isPending };
};