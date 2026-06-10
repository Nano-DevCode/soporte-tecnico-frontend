import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { foliosQueryKeys } from "../keys/folios-query.keys";
import { getMyTicketFolioDepartmentAction } from "../actions/get-my-ticket-folio-department.action";

export const useGetMyTicketFolioDepartment = () => {
    const query = useQuery({
        queryKey: foliosQueryKeys.detail('my-department'),
        queryFn: () => getMyTicketFolioDepartmentAction(),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
    });

    return {
        ...query,
    };
};