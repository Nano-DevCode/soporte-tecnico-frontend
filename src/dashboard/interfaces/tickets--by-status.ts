export interface TicketsByStatusResponse {
    data: {
        status: string;
        code: string;
        count: number;
    }[];
}