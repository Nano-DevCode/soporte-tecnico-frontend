import { getTicketPdfAction } from "../actions/get-ticket-pdf.action";
import { useState } from "react";

export const useGetTicketPdf = () => {
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
        } finally {
            setIsPending(false);
        }
    };
    return { mutate, mutateAsync: mutate, isPending };
};