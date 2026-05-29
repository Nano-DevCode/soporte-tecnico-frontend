import { useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { statusQueryKeys } from "../keys/status-query.keys";
import { getStatusAction } from "../actions/get-status.action";
export const useGetStatus = () => {

    return useQuery({
        queryKey: statusQueryKeys.lists(),
        queryFn: async () => getStatusAction(),
        staleTime: STALE_TIME_5_MIN,
    })
}
