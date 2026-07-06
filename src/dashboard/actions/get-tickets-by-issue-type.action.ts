import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { TicketStatusCode } from "@/tickets/interfaces/ticket-status-code.interface";
import type { TicketPriorityLevelString } from "@/tickets/interfaces/ticket-priority-level.type";
import type { IssueTypeDistributionItem } from "../interfaces/count-tickets";

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

export const getTicketsByIssueTypeAction = async (
    options: Options
): Promise<IssueTypeDistributionItem[]> => {
    const { data } = await soporteTecnicoApi.get<IssueTypeDistributionItem[]>(
        '/dashboard/distribution/tickets-by-issue-type',
        { params: options }
    );

    return data;
};