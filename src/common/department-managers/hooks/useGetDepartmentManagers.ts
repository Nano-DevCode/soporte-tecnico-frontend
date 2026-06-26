import { useQuery } from "@tanstack/react-query"
import { departmentManagersQueryKeys } from "../keys/department-managers-query.keys";
import { getDepartmentManagersAction } from "../actions/get-department-managers.action";
import { STALE_CATALOGS } from "@/config/query-constants";
export const useGetDepartmentManagers = () => {

    return useQuery({
        queryKey: departmentManagersQueryKeys.lists(),
        queryFn: getDepartmentManagersAction,
        staleTime: STALE_CATALOGS,
    })
}
