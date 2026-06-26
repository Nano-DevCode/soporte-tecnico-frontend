import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { FinishTicketFormOutput } from "@/tickets/schemas/finish-ticket.schema";
import type { ResponseDetails } from "../interfaces/get-response-by-ticket";

interface UpdateResponseOptions {
    ticketId: string;
    updateData: FinishTicketFormOutput;
}

export const updateResponseByTicketAction = async ({ ticketId, updateData }: UpdateResponseOptions): Promise<ResponseDetails> => {
    if (!ticketId) throw new Error('El ID del ticket es requerido para actualizar su respuesta');

    const { data } = await soporteTecnicoApi.patch<ResponseDetails>(
        `/tickets/${ticketId}/response`,
        updateData
    );

    return data;
};