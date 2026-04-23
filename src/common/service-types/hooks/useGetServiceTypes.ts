import { useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { serviceTypesQueryKeys } from "../keys/service-types-query.keys";
import { getServiceTypesAction } from "../actions/get-service-types.action";
export const useGetServiceTypes = () => {

    return useQuery({
        queryKey: serviceTypesQueryKeys.lists(),
        queryFn: async () => getServiceTypesAction(),
        staleTime: STALE_TIME_5_MIN,
    })
}
