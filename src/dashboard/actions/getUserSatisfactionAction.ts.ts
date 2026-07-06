import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { UserSatisfactionResponse, UserSatisfactionData } from "../interfaces/user-satisfaction.interface";
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

export const getUserSatisfactionAction = async (
    options: Options
): Promise<UserSatisfactionData> => {
    const { data } = await soporteTecnicoApi.get<UserSatisfactionResponse>(
        '/dashboard/metrics/user-satisfaction',
        { params: options }
    );

    return data.data;
};