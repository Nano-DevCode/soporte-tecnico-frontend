import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import type { AssignTicketPayload } from "../interfaces/assign-ticket.payload";

export interface Props {
    ticketId: string
    assignTicketPayload: AssignTicketPayload
}

export const assignTicketAction = async (
    { ticketId, assignTicketPayload }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/assign`,
        assignTicketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};