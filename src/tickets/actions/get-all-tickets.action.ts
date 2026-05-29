import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { TicketsResponse } from "../interfaces/tickets.response";
import type { TicketStatusCode } from "../interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "../interfaces/ticket-priority-level.type";

interface Options {
    limit?: number | string;
    page?: number | string;
    query?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: TicketStatusCode | undefined;
    priority?: TicketPriorityLevelString | undefined;
    department?: string | undefined;
    school_period?: string | undefined;
    issue_type?: string | undefined;
}

export const getAllTicketsAction = async (options: Options): Promise<TicketsResponse> => {
    const { limit = 10, page = 1, query, sortBy, sortOrder,
        status, priority, department, issue_type, school_period } = options;
    const parsedLimit = Number(limit);
    const parsedPage = Number(page);

    const { data } = await soporteTecnicoApi.get<TicketsResponse>('/tickets',
        {
            params: {
                limit: isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit,
                page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
                search: query,
                sortBy: sortBy,
                sortOrder: sortOrder,
                status,
                priority,
                department,
                school_period,
                issue_type
            },
        }
    );
    return data;
}