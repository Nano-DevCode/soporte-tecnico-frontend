import { useMutation } from "@tanstack/react-query";
import { getTicketPdfAction } from "../actions/get-ticket-pdf.action";

export const useGetTicketPdf = () => {
    return useMutation({
        mutationFn: getTicketPdfAction,
        onSuccess: (blob) => {
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
        },
        onError: (error) => {
            console.error("Error al obtener el PDF", error);
        }
    });
};