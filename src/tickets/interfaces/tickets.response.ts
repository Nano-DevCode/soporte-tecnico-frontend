import type { Ticket } from "./ticket.interface";

export interface TicketsResponse {
    data: Ticket[];
    meta: Meta;
}

export interface Meta {
    total:           number;
    limit:           number;
    page:            number;
    totalPages:      number;
    hasNextPage:     boolean;
    hasPreviousPage: boolean;
    lastPage:        number;
}
