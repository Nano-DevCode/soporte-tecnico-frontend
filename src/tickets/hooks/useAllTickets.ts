import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { getAllTicketsAction } from "../actions/get-all-tickets.action";
export const useAllTickets = () => {

    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const query = searchParams.get("search")?.trim() || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') || undefined;

    return useQuery({
        queryKey: ticketsQueryKeys.list({ limit, page, query, sortBy, sortOrder }),
        queryFn: async () => getAllTicketsAction({
            limit,
            page,
            query,
            sortBy,
            sortOrder,
        }),
        placeholderData: keepPreviousData,
        staleTime: STALE_TIME_5_MIN,
    })
}
