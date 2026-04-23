import { useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { coordinatorsQueryKeys } from "../keys/coordinators-query.keys";
import { getCoordinatorsAction } from "../actions/get-coordinators.action";
export const useGetCoordinators = () => {

    return useQuery({
        queryKey: coordinatorsQueryKeys.lists(),
        queryFn: async () => getCoordinatorsAction(),
        staleTime: STALE_TIME_5_MIN,
    })
}
