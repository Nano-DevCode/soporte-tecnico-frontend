import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateTicketPayload } from "../interfaces/create-ticket-payload.interface";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";

interface CreateTicketParams {
    data: CreateTicketPayload;
    idempotencyKey: string;
}

export const createTicketAction = async (
    { data: ticketPayload, idempotencyKey }: CreateTicketParams
): Promise<TicketDetailsResponse> => {

    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        '/tickets',
        ticketPayload,
        {
            headers: {
                'x-idempotency-key': idempotencyKey,
            },
        }
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};