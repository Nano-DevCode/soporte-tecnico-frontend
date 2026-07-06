import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";
import type { DepartmentDistributionItem } from "../interfaces/count-tickets";

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

export const getTicketsByDepartmentAction = async (
    options: Options
): Promise<DepartmentDistributionItem[]> => {
    const { data } = await soporteTecnicoApi.get<DepartmentDistributionItem[]>(
        '/dashboard/distribution/tickets-by-department',
        { params: options }
    );

    return data;
};