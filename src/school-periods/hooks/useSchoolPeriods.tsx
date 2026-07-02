import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { getSchoolPeriodsAction } from "../actions/get-school-periods.action";
import { schoolPeriodQueryKeys } from "../keys/school-period-query.keys";
import { STALE_TIME_5_MIN } from "@/config/query-constants";

export const useSchoolPeriods = () => {

  const [searchParams] = useSearchParams();

  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get("search")?.trim() || undefined;
  const status = searchParams.get('status') || undefined;
  const statusValue = status === '1'
    ? true
    : status === '0'
      ? false
      : undefined;

  const { data, isLoading, isError, isFetching, refetch, isPlaceholderData } = useQuery({
    queryKey: schoolPeriodQueryKeys.list({ limit, page, query, status: statusValue }),
    queryFn: async () => getSchoolPeriodsAction({
      limit,
      page,
      query,
      status: statusValue,
    }),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME_5_MIN,
  })

  return { data, isLoading, isError, isFetching, refetch, isPlaceholderData };
}
