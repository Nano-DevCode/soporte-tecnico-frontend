import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateTicketOnBehalfPayload } from "../interfaces/create-ticket-payload.interface";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";


interface Props {
    data: CreateTicketOnBehalfPayload;
    idempotencyKey: string;
}

export const createTicketOnBehalfAction = async (
    { data: ticketOnBehalfPayload, idempotencyKey }: Props
): Promise<TicketDetailsResponse> => {

    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        '/tickets/on-behalf',
        ticketOnBehalfPayload,
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