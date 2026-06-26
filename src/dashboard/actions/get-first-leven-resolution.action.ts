import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { FirstLevelResolution } from "../interfaces/first-level-resolution";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";

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

export const getFirstLevelResolutionAction = async (options: Options): Promise<FirstLevelResolution> => {
    const { data } = await soporteTecnicoApi.get<FirstLevelResolution>(
        `/dashboard/first-level-resolution`,
        { params: options }
    );

    return data;
};