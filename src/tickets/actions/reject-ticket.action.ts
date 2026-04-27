import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import type { RejectTicketPayload } from "../interfaces/reject-ticket.payload";

export interface Props {
    ticketId: string;
    rejectTicketPayload: RejectTicketPayload;
}

export const rejectTicketAction = async ({
    ticketId, rejectTicketPayload }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/reject`,
        rejectTicketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};