import { useMutation } from "@tanstack/react-query";
import { getTicketResponsePdfAction } from "../actions/get-ticket-response-pdf";

export const useGetTicketResponsePdf = () => {
    return useMutation({
        mutationFn: getTicketResponsePdfAction,
        onSuccess: (blob) => {
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
        },
        onError: (error) => {
            console.error("Error al obtener el PDF", error);
        }
    });
};