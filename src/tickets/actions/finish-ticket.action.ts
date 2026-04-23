import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import type { FinishTicketPayload } from "../interfaces/finish-ticket.payload";

export interface Props {
    ticketId: string
    finishTicketPayload: FinishTicketPayload
}

export const finishTicketAction = async (
    { ticketId, finishTicketPayload }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/finish`,
        finishTicketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};