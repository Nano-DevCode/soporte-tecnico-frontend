import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { isAxiosError } from "axios";

export const regenerateTicketPdfAction = async (ticketId: string, type: 'request' | 'response'): Promise<void> => {
    try {
        await soporteTecnicoApi.post(`/tickets/${ticketId}/regenerate-pdf`, { type });
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Error al regenerar el documento", { cause: error });
        }
        throw new Error("Error desconocido al regenerar el documento", { cause: error });
    }
};
