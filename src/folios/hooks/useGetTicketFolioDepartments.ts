import { useQuery } from "@tanstack/react-query"
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { foliosQueryKeys } from "../keys/folios-query.keys";
import { getAllTicketFolioDepartmentsAction } from "../actions/get-all-ticket-folio-departments.action";
export const useGetTicketFolioDepartments = () => {

    return useQuery({
        queryKey: foliosQueryKeys.lists(),
        queryFn: async () => getAllTicketFolioDepartmentsAction(),
        staleTime: STALE_TIME_5_MIN,
    })
}
