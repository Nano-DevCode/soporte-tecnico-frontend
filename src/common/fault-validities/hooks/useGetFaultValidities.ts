import { useQuery } from "@tanstack/react-query"
import { STALE_CATALOGS } from "@/config/query-constants";
import { faultValiditiesQueryKeys } from "../keys/fault-validities-query.keys";
import { getFaultValiditiesAction } from "../actions/get-fault-validities.action";
export const useGetFaultValidities = () => {

    return useQuery({
        queryKey: faultValiditiesQueryKeys.lists(),
        queryFn: async () => getFaultValiditiesAction(),
        staleTime: STALE_CATALOGS,
    })
}
