import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { CostPerIncident } from "../interfaces/cost-per-incident";
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

export const getCostPerIncidentAction = async (options: Options): Promise<CostPerIncident> => {

    const { data } = await soporteTecnicoApi.get<CostPerIncident>(
        `/dashboard/cost-per-incident`,
        { params: options }
    );

    return data;
};