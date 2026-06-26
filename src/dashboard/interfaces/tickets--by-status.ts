export interface TicketsByStatusResponse {
    data: {
        status: string;
        count: number;
    }[];
}