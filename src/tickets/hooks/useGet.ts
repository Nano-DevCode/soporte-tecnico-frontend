import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import type { TicketStatusCode } from "../interfaces/ticket-status-code.interface";
import { getClosedAndArchivedTicketsAction } from "../actions/get-closed-and-archive-tickets.actions";

export const useClosedArchivedTickets = () => {
    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get("search")?.trim() || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') || undefined;
    const status = searchParams.get('status') as TicketStatusCode || undefined;
    const department = searchParams.get('department') as string || undefined;
    const school_period = searchParams.get('school_period') as string || undefined;
    const start_date = searchParams.get('start_date') as string || undefined;
    const end_date = searchParams.get('end_date') as string || undefined;

    return useQuery({
        queryKey: ticketsQueryKeys.closedArchivedList({
            limit, page, query, sortBy, sortOrder, status,
            department, school_period, start_date, end_date
        }),
        queryFn: async () => getClosedAndArchivedTicketsAction({
            limit,
            page,
            query,
            sortBy,
            sortOrder,
            status,
            department,
            school_period,
            start_date,
            end_date,
        }),
        staleTime: STALE_TIME_5_MIN,
    });
}