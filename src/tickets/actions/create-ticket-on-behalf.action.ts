import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateTicketOnBehalfPayload } from "../interfaces/create-ticket-payload.interface";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";

export const createTicketOnBehalfAction = async (
    ticketOnBehalfPayload: CreateTicketOnBehalfPayload
): Promise<TicketDetailsResponse> => {

    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        '/tickets/on-behalf',
        ticketOnBehalfPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};