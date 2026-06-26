import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";
import type { TicketsByStatusResponse } from "../interfaces/tickets--by-status";

interface Options {
    status?: TicketStatusCode | undefined;
    priority?: TicketPriorityLevelString | undefined;
    department?: string | undefined;
    school_period?: string | undefined;
    issue_type?: string | undefined;
    tags?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}

export const getTicketsByStatusAction = async (options: Options): Promise<TicketsByStatusResponse> => {
    const { data } = await soporteTecnicoApi.get<TicketsByStatusResponse>(
        `/dashboard/tickets-by-status`,
        { params: options }
    );
    return data;
};