import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { ResolutionTimeResponse } from "../interfaces/ResolutionTimeByPriority";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";

interface Options {
    status?: TicketStatusCode;
    priority?: TicketPriorityLevelString;
    department?: string;
    school_period?: string;
    issue_type?: string;
    tags?: string;
    start_date?: string;
    end_date?: string;
}

export const getResolutionTimeAction = async (options: Options): Promise<ResolutionTimeResponse> => {
    const { data } = await soporteTecnicoApi.get<ResolutionTimeResponse>(
        `/dashboard/resolution-time-by-priority`,
        { params: options }
    );
    return data;
};