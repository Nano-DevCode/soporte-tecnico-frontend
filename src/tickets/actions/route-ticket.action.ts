import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketDetailsResponse } from "../interfaces/ticket-details.response";
import type { RouteTicketPayload } from "../interfaces/route-ticket.payload";

export interface Props {
    ticketId: string
    routeTicketPayload: RouteTicketPayload
}

export const routeTicketAction = async ({
    ticketId, routeTicketPayload }: Props
): Promise<TicketDetailsResponse> => {
    const { data } = await soporteTecnicoApi.post<TicketDetailsResponse>(
        `/tickets/${ticketId}/route`,
        routeTicketPayload
    );

    return {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
};