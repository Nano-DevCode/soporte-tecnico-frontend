import { useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { maintenanceTypesQueryKeys } from "../keys/maintenance-types-query.keys";
import { getMaintenanceTypesAction } from "../actions/get-maintenance-types.action";
export const useGetMaintenanceTypes = () => {

    return useQuery({
        queryKey: maintenanceTypesQueryKeys.lists(),
        queryFn: async () => getMaintenanceTypesAction(),
        staleTime: STALE_TIME_5_MIN,
    })
}
