import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";


export const getTicketByIdAction = async (id: string): Promise<TicketDetailsResponse> => {
    if (!id) throw new Error('Id is required');

    const { data } = await soporteTecnicoApi.get<TicketDetailsResponse>(`/tickets/${id}`);

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};