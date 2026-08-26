import { useMutation } from '@tanstack/react-query';
import { regenerateTicketPdfAction } from '../actions/regenerate-ticket-pdf.action';
import { sileo } from 'sileo';

export const useRegenerateTicketPdf = () => {
    return useMutation({
        mutationFn: ({ ticketId, type }: { ticketId: string, type: 'request' | 'response' }) => regenerateTicketPdfAction(ticketId, type),
        onSuccess: () => {
            sileo.success({
                title: 'Éxito',
                description: 'El documento PDF se ha regenerado correctamente.',
            });
        },
        onError: (error) => {
            sileo.error({
                title: 'Error',
                description: error.message || 'No se pudo regenerar el documento PDF.',
            });
        },
    });
};
