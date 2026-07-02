import { useQuery } from "@tanstack/react-query";
import { STALE_TIME_5_MIN } from "@/config/query-constants";
import { getRejectReportAction } from "../actions/get-rejection-report.action";
import { rejectionReportQueryKeys } from "../keys/rejection-report.query.keys";

export const useGetRejectionReport = (id?: string) => {
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching,
        refetch
    } = useQuery({
        queryKey: id ? rejectionReportQueryKeys.detail(id) : rejectionReportQueryKeys.details(),
        queryFn: () => getRejectReportAction(id!),
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