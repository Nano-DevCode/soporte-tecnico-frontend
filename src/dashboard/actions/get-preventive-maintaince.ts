import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";
import type { MaintenanceCompliance } from "../interfaces/maintaince-compliance";

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

export const getPreventiveMaintenanceAction = async (options: Options): Promise<MaintenanceCompliance> => {

    const { data } = await soporteTecnicoApi.get<MaintenanceCompliance>(
        `/dashboard/preventive-maintenance-coverage`,
        { params: options }
    );

    return data;
};