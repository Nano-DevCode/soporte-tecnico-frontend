import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { foliosQueryKeys } from "../keys/folios-query.keys";
import { getTicketFolioDepartmentByIdAction } from "../actions/get-ticket-folio-by-id-department.action";

export const useGetTicketFolioByIdDepartment = (id?: string) => {
    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch
    } = useQuery({
        queryKey: id ? foliosQueryKeys.detail(id) : foliosQueryKeys.details(),
        queryFn: () => getTicketFolioDepartmentByIdAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });

    return {
        data,
        isLoading,
        isError,
        isFetching,
        refetch
    };
};