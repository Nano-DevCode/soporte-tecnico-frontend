import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { getAllTicketsAction } from "../actions/get-all-tickets.action";
import type { TicketPriorityLevelString } from "../interfaces/ticket-priority-level.type";
import type { TicketStatusCode } from "../interfaces/ticket-status-code.interface";
export const useAllTickets = () => {

    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get("search")?.trim() || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') || undefined;
    const status = searchParams.get('status') as TicketStatusCode || undefined;
    const priority = searchParams.get('priority') as TicketPriorityLevelString || undefined;
    const department = searchParams.get('department') as string || undefined;
    const school_period = searchParams.get('school_period') as string || undefined;
    const issue_type = searchParams.get('issue_type') as string || undefined;

    return useQuery({
        queryKey: ticketsQueryKeys.list({
            limit, page, query, sortBy, sortOrder, status, priority,
            department, school_period, issue_type
        }),
        queryFn: async () => getAllTicketsAction({
            limit,
            page,
            query,
            sortBy,
            sortOrder,
            status,
            priority,
            department,
            school_period,
            issue_type
        }),
        staleTime: STALE_TIME_5_MIN,
    })
}
