import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { ticketsQueryKeys } from "../keys/tickets-query.keys";
import { getTicketByIdAction } from "../actions/get-ticket-by-id.action";

export const useGetTicketById = (id?: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useQuery({
        queryKey: id ? ticketsQueryKeys.detail(id) : ticketsQueryKeys.details(),
        queryFn: () => getTicketByIdAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });

    return {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    };
};