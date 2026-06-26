import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";
import type { MTTRResponse } from "../interfaces/MTTR";

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

export const getMTTRAction = async (options: Options): Promise<MTTRResponse> => {
    const { status, priority, department, issue_type, school_period,
        start_date, end_date, tags } = options;

    const { data } = await soporteTecnicoApi.get<MTTRResponse>(`/dashboard/mttr`,
        {
            params: {
                status,
                priority,
                department,
                school_period,
                issue_type,
                tags,
                start_date,
                end_date
            },
        }
    );

    return data;
};