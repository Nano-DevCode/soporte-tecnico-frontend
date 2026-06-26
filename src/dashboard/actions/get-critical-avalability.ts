import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CriticalAvailability } from "../interfaces/critical-availability";
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

export const getCriticalAvailabilityAction = async (options: Options): Promise<CriticalAvailability> => {

    const { data } = await soporteTecnicoApi.get<CriticalAvailability>(`/dashboard/metrics/critical-availability`,
        { params: options }
    );

    return data;
};