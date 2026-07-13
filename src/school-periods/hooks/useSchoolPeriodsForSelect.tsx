import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { schoolPeriodQueryKeys } from "../keys/school-period-query.keys";
import { getSchoolPeriodsForSelectAction } from "../actions/get-school-periods-for-select.action";
import { STALE_CATALOGS } from "@/config/query-constants";

interface Options {
  enabled?: boolean;
}

export const useSchoolPeriodsForSelect = (options?: Options) => {
  const { data, isLoading, isError, isFetching, refetch, isPlaceholderData } = useQuery({
    queryKey: schoolPeriodQueryKeys.list({ type: 'for-select' }),
    queryFn: async () => getSchoolPeriodsForSelectAction(),
    placeholderData: keepPreviousData,
    staleTime: STALE_CATALOGS,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  })

  return { data, isLoading, isError, isFetching, refetch, isPlaceholderData };
}
