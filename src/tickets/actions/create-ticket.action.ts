import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateTicketPayload } from "../interfaces/create-ticket-payload.interface";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";

export const createTicketAction = async (
    ticketPayload: CreateTicketPayload
): Promise<TicketDetailsResponse> => {

    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        '/tickets',
        ticketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};