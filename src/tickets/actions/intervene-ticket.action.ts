import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import type { InterveneTicketPayload } from "../interfaces/intervene-ticket.payload";

export interface Props {
    ticketId: string
    interveneTicketPayload: InterveneTicketPayload
}

export const interveneTicketAction = async (
    { ticketId, interveneTicketPayload }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/intervene`,
        interveneTicketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};