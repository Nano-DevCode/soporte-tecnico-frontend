import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CreateTicketPayload } from "../interfaces/create-ticket-payload.interface";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";

export interface EditTicketParams {
    id: string;
    editTicketPayload: Partial<CreateTicketPayload>;
}

export const editTicketAction = async (
    { id, editTicketPayload }: EditTicketParams
): Promise<TicketDetailsResponse> => {

    const { data } = await soporteTecnicoApi.patch<TicketDetailsResponse>(
        `/tickets/${id}/edit`,
        editTicketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};