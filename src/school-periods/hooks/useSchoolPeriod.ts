import { useQuery } from "@tanstack/react-query";
import { getSchoolPeriodByIdAction } from "../actions/get-school-period-by-id.action";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { schoolPeriodQueryKeys } from "../keys/school-period-query.keys";

export const useSchoolPeriod = (id?: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useQuery({
        queryKey: id ? schoolPeriodQueryKeys.detail(id) : schoolPeriodQueryKeys.details(),
        queryFn: () => getSchoolPeriodByIdAction(id!),
        retry: false,
        staleTime: STALE_TIME_5_MIN,
        enabled: !!id,
    });
    return {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    };
};