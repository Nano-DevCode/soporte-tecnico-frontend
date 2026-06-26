import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { responsesQueryKeys } from "../keys/responses-query.keys";
import { getResponseByTicketIdAction } from "../actions/get-response-by-ticket-id.action";

export const useGetResponseByTicketId = (id?: string) => {
    const query = useQuery({
        queryKey: responsesQueryKeys.byTicket(id ?? ''),
        queryFn: () => getResponseByTicketIdAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });

    return {
        ...query,
    };
};