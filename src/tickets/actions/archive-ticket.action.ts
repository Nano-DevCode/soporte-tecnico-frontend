import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";

export interface Props {
    ticketId: string
}

export const archiveTicketAction = async (
    { ticketId }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/archive`
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};